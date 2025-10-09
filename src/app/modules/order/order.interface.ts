import { Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrderStatusDates {
  placedAt?: Date;
  paymentProcessedAt?: Date;
  shippedAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

export interface IShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IPaymentInfo {
  cardLast4?: string;
  paymentStatus?: "pending" | "paid" | "failed";
  paymentDate?: Date;
  transactionId?: string;
}

export interface IContacktInfo {
  email: string;
  phone?: string;
}

export interface IAdminStatistics {
  totalSales: number;
  totalOrders: number;
  activeUsers: number;
  totalProducts: number;
}

export interface IOrderStatusCounts {
  newOrders: number;
  processing: number;
  completed: number;
}

export interface IOrderStatusSummary {
  status: string;
  count: number;
  percentage: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  items: IOrderItem[]; // Array of order items
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  contactInfo: IContacktInfo;
  paymentInfo?: IPaymentInfo;
  status:
    | "placed"
    | "payment_processed"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "returned";
  statusDates: IOrderStatusDates;
  shippingAddress: IShippingAddress;

  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
