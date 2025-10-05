import { Schema, model, Document } from "mongoose";
import { ICartItem } from "./cart.interface";

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
  },
  { _id: false }
);

export interface ICart extends Document {
  userId: Schema.Types.ObjectId;
  items: ICartItem[]; // Array of cart items
  subTotal: number;
}

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    items: { type: [CartItemSchema], required:true}, // Array of CartItems
    subTotal: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Cart = model<ICart>("Cart", CartSchema);
