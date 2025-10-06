import { Types } from "mongoose";

export type TUser = {
  role: "Buyer" | "Seller" | "Admin";
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isDeleted?: boolean;
  address?: {
    state?: string;
    city?: string;
    zip?: string;
    streetAddress?: string;
  };
  paymentMethod?: [
    {
      method?: string;
      cardNumber?: string;
      expiryDate?: string;
      cvv?: number;
    }
  ];
  Preferences?: "Fashion" | "Food" | "Beauty" | "Perfume";
  businessInfo?: {
    businessName?: string;
    businessType?: string;
    businessDescription?: string;
    country?: string;
    phoneNumber?: string;
    businessLogo?: string;
  };
};
