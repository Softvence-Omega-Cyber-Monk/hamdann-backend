import mongoose, { Schema, Document } from "mongoose";
import { IOrder, IOrderItem, IOrderStatusDates } from "./order.interface";

// Sub-schema for order items
const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
  },
  { _id: false }
);

// Sub-schema for order status dates
const OrderStatusDatesSchema = new Schema<IOrderStatusDates>(
  {
    placedAt: { type: Date },
    paymentProcessedAt: { type: Date },
    shippedAt: { type: Date },
    outForDeliveryAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { _id: false }
);

// Function to generate unique order number
const generateOrderNumber = (): string => {
  const datePart = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 8); // YYYYMMDD
  const randomPart = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `ORD-${datePart}-${randomPart}`;
};


// Main order schema
const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: generateOrderNumber, // generate automatically
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "placed",
        "payment_processed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
    statusDates: { type: OrderStatusDatesSchema, default: {} },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
