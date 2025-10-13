import mongoose, { Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const PaymentSchema = new Schema<IPayment>(
  {
    // ✅ For order payments
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },

    // ✅ For subscription payments
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    plan: {
      type: String,
      enum: ["basic", "professional", "premium"],
    },
    isSubscription: { type: Boolean, default: false },

    // ✅ Common fields
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "aed" },
    paymentStatus: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
    paymentIntentId: { type: String, required: true },
    mode: {
      type: String,
      enum: ["payment", "subscription"],
    }
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
