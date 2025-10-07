import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

// Sub-schema for Payment Methods
const PaymentMethodSchema = new Schema(
  {
    method: {
      type: String,
      required: true,
      enum: ["Visa", "Mastercard", "PayPal", "Bank Transfer"], // extendable
    },
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true } // 👈 ensures each payment method gets its own ObjectId (paymentId)
);

// Sub-schema for Address
const AddressSchema = new Schema(
  {
    state: { type: String },
    city: { type: String },
    zip: { type: String },
    streetAddress: { type: String },
  },
  { _id: false }
);

// Sub-schema for Business Info
const BusinessInfoSchema = new Schema(
  {
    businessName: { type: String },
    businessType: { type: String },
    businessDescription: { type: String },
    country: { type: String },
    phoneNumber: { type: String },
    businessLogo: { type: String },
  },
  { _id: false }
);

// ----------------------
// ✅ MAIN USER SCHEMA
// ----------------------
const UserSchema = new Schema<TUser>(
  {
    role: { type: String, required: true, enum: ["user", "admin", "seller"] },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },

    isDeleted: { type: Boolean, default: false },

    address: { type: AddressSchema, default: {} },

    paymentMethods: [PaymentMethodSchema], // 👈 changed name to plural for clarity

    preferences: {
      type: String,
      trim: true,
      enum: ["Fashion", "Food", "Beauty", "Perfume"],
    },

    businessInfo: { type: BusinessInfoSchema, default: {} },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User_Model = model<TUser>("User", UserSchema);
