import { Order } from "./order.model";
import { IOrder, IOrderItem } from "./order.interface";
import { Types } from "mongoose";

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
    orderData.cartId.items as IOrderItem[]
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

  if (filters.userId) query.userId = filters.userId;
  if (filters.status) query.status = filters.status;

  try {
    return await Order.find(query)
      .populate("userId", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 }); // newest orders first
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

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
};
