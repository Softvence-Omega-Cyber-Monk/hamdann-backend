import { Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;       // Reference to Product
  price: number;           // Snapshot of product price at time of order
  quantity: number;        // How many purchased
  image?: string;          // Optional product image
}

export interface IOrderStatusDates {
  placedAt?: Date;
  paymentProcessedAt?: Date;
  shippedAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;     // e.g. #9834442
  userId?: Types.ObjectId;          // Reference to User
  items: IOrderItem[];
  totalAmount: number;
  currency: string;        // e.g. "AED", "USD"
  paymentMethod: string;   // e.g. "Credit Card", "Cash on Delivery"
  status: "placed" | "payment_processed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";
  statusDates: IOrderStatusDates;  // <-- each status has its own timestamp
  shippingAddress: string; // or better: { street, city, country, zip }
  createdAt?: Date;
  updatedAt?: Date;
}
