import { Document, ObjectId } from "mongoose";

export interface IPayment extends Document {
  // For order payments
  orderId?: ObjectId;

  // For subscription payments
  userId?: ObjectId;
  plan?: "starter" | "advance" | "starterYearly" | "advanceYearly";
  isSubscription?: boolean;

  // Common fields
  amount: number;
  currency: string;
  paymentStatus: "pending" | "succeeded" | "failed";
  paymentIntentId: string;
  createdAt?: Date;
  updatedAt?: Date;
  mode: "payment" | "subscription";
}
