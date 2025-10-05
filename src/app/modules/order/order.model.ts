import mongoose, { Schema, Document } from "mongoose";
import {
  IOrder,
  IOrderStatusDates,
  IShippingAddress,
  IPaymentInfo,
} from "./order.interface";

// OrderStatusDates Schema
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

// ShippingAddress Schema
const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

// PaymentInfo Schema
const PaymentInfoSchema = new Schema<IPaymentInfo>(
  {
    cardLast4: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentDate: { type: Date },
    transactionId: { type: String },
  },
  { _id: false }
);

// Function to generate a unique order number
const generateOrderNumber = (): string => {
  const datePart = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 8); // YYYYMMDD
  const randomPart = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `ORD-${datePart}-${randomPart}`;
};

// Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: generateOrderNumber, 
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" }, 
    cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true }, 
    subtotal: { type: Number, required: true }, 
    shippingCost: { type: Number, required: true }, 
    tax: { type: Number, required: true }, 
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true }, 

    paymentMethod: { type: String, required: true }, 
    paymentInfo: { type: PaymentInfoSchema, default: {} }, 

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
      default: "placed", // Default status is 'placed'
    },

    statusDates: {
      type: OrderStatusDatesSchema,
      default: { placedAt: new Date() }, // Default status date is 'placedAt' set to current date
    },

    shippingAddress: { type: ShippingAddressSchema, required: true }, // Shipping address (required)
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Add pre-save hook to generate order number if it's not set
OrderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = generateOrderNumber();
  }
  next();
});

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
