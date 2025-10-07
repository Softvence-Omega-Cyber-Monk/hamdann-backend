import { Types } from "mongoose";

export type TAddress = {
  state?: string;
  city?: string;
  zip?: string;
  streetAddress?: string;
};

export type TPaymentMethod = {
  _id?: Types.ObjectId; // 👈 paymentId used for update/delete
  method: "Visa" | "Mastercard" | "PayPal" | "Bank Transfer";
  cardNumber: string;
  expiryDate: string;
  cvv: number;
  isDefault?: boolean;
};

export type TBusinessInfo = {
  businessName?: string;
  businessType?: string;
  businessDescription?: string;
  country?: string;
  phoneNumber?: string;
  businessLogo?: string;
};

export type TUser = {
  _id?: Types.ObjectId;
  role: "user" | "admin" | "seller";
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isDeleted?: boolean;
  address?: TAddress;
  paymentMethods?: TPaymentMethod[]; // 👈 plural & consistent with model
  preferences?: "Fashion" | "Food" | "Beauty" | "Perfume";
  businessInfo?: TBusinessInfo;
  createdAt?: Date;
  updatedAt?: Date;
};
