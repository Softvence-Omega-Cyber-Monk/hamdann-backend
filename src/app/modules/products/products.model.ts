import mongoose, { Schema } from "mongoose";
import { IProduct } from "./products.interface";


const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Fashion", "Food", "Beauty", "Perfume"], // restrict categories
    },
    brand: { type: String, trim: true },
    weight: { type: Number },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    availableSizes: [{ type: String }],
    availableColors: [{ type: String }],
    variations: [{ type: String }], // e.g., ["Red - M", "Blue - L"]
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    productImages: [{ type: String, required: true }],
    salesCount: { type: Number, default: 0 }, // Flag for best-selling
    isNewArrival: { type: Boolean, default: false }, // Flag for new arrival
    isWishlisted: { type: Boolean, default: false }, // Flag for wishlist
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
