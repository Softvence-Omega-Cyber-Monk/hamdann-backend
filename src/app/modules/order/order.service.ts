import { Order } from "./order.model";
import { IOrder, IOrderItem } from "./order.interface";
import { Types } from "mongoose";
import { cleanRegex } from "zod/v4/core/util.cjs";

interface IOrderFilters {
  userId?: string;
  status?: string;
}

// Utility function to calculate subtotal, shipping cost, and total amount
const calculateOrderAmounts = (items: IOrderItem[]) => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate shipping cost as 10% of the subtotal
  const shippingCost = subtotal * 0.1; // 10% of subtotal

  // Calculate tax as 5% of the subtotal
  const tax = subtotal * 0.05; // 5% of subtotal

  // Calculate the total amount (subtotal + shipping cost + tax)
  const totalAmount = subtotal + shippingCost + tax;

  return { subtotal, shippingCost, tax, totalAmount };
};

// Create Order
const createOrder = async (orderData: IOrder) => {
  // Calculate order amounts
  const { subtotal, shippingCost, tax, totalAmount } = calculateOrderAmounts(
    orderData.items
  );

  try {
    const order = new Order({
      ...orderData,
      subtotal,
      shippingCost,
      tax, // Include the tax in the order
      totalAmount,
    });

    // Save and return the created order
    return await order.save();
  } catch (error: any) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

// Get all orders with optional filters
const getAllOrders = async (filters: IOrderFilters = {}): Promise<IOrder[]> => {
  const query: Record<string, any> = {};

  // Apply filters
  if (filters.userId) query.userId = filters.userId;
  if (filters.status) query.status = filters.status;

  try {
    const orders = await Order.find(query)
      .populate({
        path: "userId",
        select: "name email", // only return these fields
      })
      .populate({
        path: "items.productId",
        select: "name price stock image", // you can add more fields as needed
      })
      .sort({ createdAt: -1 }); // newest first

    return orders;
  } catch (error: any) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
};

// Get a single order by ID
const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  try {
    return await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("items.productId", "name price");
  } catch (error: any) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
};

// Update an order
const updateOrder = async (
  orderId: string,
  updateData: Partial<IOrder>
): Promise<IOrder | null> => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  try {
    return await Order.findByIdAndUpdate(orderId, updateData, { new: true })
      .populate("userId", "name email")
      .populate("items.productId", "name price");
  } catch (error: any) {
    throw new Error(`Failed to update order: ${error.message}`);
  }
};

const getCurrentOrdersService = async (userId: string) => {
  const currentStatuses = [
    "placed",
    "payment_processed",
    "shipped",
    "out_for_delivery",
  ];
  const orders = await Order.find({
    userId,
    status: { $in: currentStatuses },
  }).sort({ createdAt: -1 });
  return orders;
};

// 🟣 Get previous (completed/cancelled) orders
const getPreviousOrdersService = async (userId: string) => {
  const previousStatuses = ["delivered", "cancelled", "returned"];
  const orders = await Order.find({
    userId,
    status: { $in: previousStatuses },
  }).sort({ createdAt: -1 });
  return orders;
};

// Add this to your existing order.service.ts

const getUserOrderStatistics = async (userId: string) => {
  try {
    const totalOrders = await Order.countDocuments({ userId });

    const pendingOrders = await Order.countDocuments({
      userId,
      status: {
        $in: ["placed", "payment_processed", "shipped", "out_for_delivery"],
      },
    });

    // console.log('pending orders ',pendingOrders)

    const salesResult = await Order.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    // console.log('sales reslult ',salesResult)

    const returnedOrders = await Order.countDocuments({
      userId,
      status: "returned",
    });

    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    return {
      totalOrders,
      pendingOrders,
      totalSales,
      returnedOrders,
    };
  } catch (error: any) {
    throw new Error(`Failed to get order statistics: ${error.message}`);
  }
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  getCurrentOrdersService,
  getPreviousOrdersService,
  getUserOrderStatistics,
};
