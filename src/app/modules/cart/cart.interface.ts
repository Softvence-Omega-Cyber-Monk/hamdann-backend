import { Types } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  price: number;
  quantity: number;
  image?: string;
  subTotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
}
