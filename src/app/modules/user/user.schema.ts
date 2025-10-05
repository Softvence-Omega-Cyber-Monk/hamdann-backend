import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import { number, string } from "zod";

const user_schema = new Schema<TUser>(
  {
    role: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true ,unique: true},
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    address: {
      state: { type: String },
      city: { type: String },
      zip: { type: String },
      streetAddress: { type: String },
    },
    paymentMethod: [
      {
        method: { type: String },
        cardNumber: { type: String },
        expiryDate: { type: String },
        cvv: { type: Number },
      },
    ],
    Preferences: {
      type: String,
      enum: ["Fashion", "Food", "Beauty", "Perfume"],
      
    },
    businessInfo: {
      businessName: { type: String },
      businesswType: { type: String },
      businessDescription: { type: String },
      country: { type: String },
      phoneNumber: { type: String },
      businessLogo: { type: String },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User_Model = model("user", user_schema);
