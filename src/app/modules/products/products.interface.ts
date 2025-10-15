import { Types } from "mongoose";
import { Type } from "typescript";

export interface IProduct {
  _id?: string;
  userId: Types.ObjectId;
  name: string;
  sku: string;
  category: "Fashion" | "Food" | "Beauty" | "Perfume";
  brand?: string;
  shopName?: string | null;
  weight?: number;
  gender?: "male" | "female" | string;
  availableSizes?: string[]; // ["S", "M", "L", "XL"]
  availableColors?: string[]; // hex values or names
  variations?: string[]; // e.g., ["Red - M", "Blue - L"]
  description: string;
  quantity: number;
  price: number;
  productImages?: string[];
  reviews?: { rating: number; comment?: string ; userId :string }[];
  shopReviews?: number | null;
  averageRating?: number;
  salesCount: number; // Tracks the number of sales       
  isNewArrival: boolean; // Flag for new arrival      
  isWishlisted?: boolean; // Flag for wishlist
  createdAt?: Date;
  updatedAt?: Date;
  newPrice?: number;
}
