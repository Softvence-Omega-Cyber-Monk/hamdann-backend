import mongoose, { Schema } from "mongoose";
import { IProduct, IProductVariation } from "./products.interface";

const ProductVariationSchema = new Schema<IProductVariation>({
  image: { type: String },
  color: { type: String },
  size: { type: String },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
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
    variations: [ProductVariationSchema],
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    productImages: [{ type: String, required: true }],
    isBestSeller: { type: Boolean, default: false }, // Flag for best-selling
    isNewArrival: { type: Boolean, default: false }, // Flag for new arrival
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
