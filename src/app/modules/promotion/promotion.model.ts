import { Schema, model, Types } from "mongoose";
import { IPromotion } from "./promotion.interface";

const PromotionSchema = new Schema<IPromotion>(
  {
    promotionImage: { type: String, required: true },
    promotionName: { type: String, required: true },
    promotionType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    minimumPurchase: { type: Number, required: true },
    allProducts: [{ type: Types.ObjectId, ref: "Product" }],
    specificProducts: [{ type: Types.ObjectId, ref: "Product" }],
    ProductsCategories: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    termsAndConditions: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PromotionModel = model<IPromotion>("Promotion", PromotionSchema);
