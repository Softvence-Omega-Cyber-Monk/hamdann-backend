import { Order } from "./order.model";
import { IOrder, IOrderItem } from "./order.interface";
import { Types } from "mongoose";

interface IOrderFilters {
  userId?: string;
  status?: string;
}

// Create Order
const createOrder = async (orderData: IOrder) => {
  const totalAmount = orderData.items.reduce(
    (total: number, item: IOrderItem) => total + item.price * item.quantity,
    0
  );

  const order = new Order({
    ...orderData,
    totalAmount, 
  });

  return await order.save();
};

// Get all orders, optionally filtered
const getAllOrders = async (filters: IOrderFilters = {}): Promise<IOrder[]> => {
  const query: any = {};

  if (filters.userId) query.userId = filters.userId;
  if (filters.status) query.status = filters.status;

  try {
    return await Order.find(query)
      .populate("userId", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 }); // newest orders first
  } catch (error) {
    throw new Error(`Failed to fetch orders: ${error}`);
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
  } catch (error) {
    throw new Error(`Failed to fetch order: ${error}`);
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
  } catch (error) {
    throw new Error(`Failed to update order: ${error}`);
  }
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
};
