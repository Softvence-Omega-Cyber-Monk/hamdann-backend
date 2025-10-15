import { IPromotion } from "./promotion.interface";
import { PromotionModel } from "./promotion.model";
import { Product } from "../products/products.model";
import mongoose from "mongoose";

// ✅ CREATE PROMOTION SERVICE
export const createPromotionService = async (payload: IPromotion) => {
  console.log("Initial Payload:", payload);

  let applicableProducts: any[] = [];

  // 🔹 Case 1: Apply to all products
  if (payload.applicableType === "allProducts") {
    const all = await Product.find({}, "_id");
    applicableProducts = all.map((p) => p._id);
    payload.allProducts = applicableProducts;
    payload.specificProducts = []; // ✅ clear others
    payload.productCategories = [];
  }

  // 🔹 Case 2: Apply to specific products
  // 🔹 Case 2: Apply to specific products
  else if (
    payload.applicableType === "specificProducts" &&
    payload.specificProducts?.length
  ) {
    payload.allProducts = payload.specificProducts; // ✅ unify
    payload.productCategories = [];
  }

  // 🔹 Case 3: Apply to product categories
  else if (
    payload.applicableType === "productCategories" &&
    payload.productCategories?.length
  ) {
    const categoryProducts = await Product.find(
      { category: { $in: payload.productCategories } },
      "_id"
    );
    applicableProducts = categoryProducts.map((p) => p._id);
    payload.allProducts = applicableProducts;
    payload.specificProducts = []; // ✅ clear others
  }

  // ✅ Create promotion
  const promotion = await PromotionModel.create(payload);

  console.log("Final Promotion Data:", promotion);

  return promotion;
};

// ✅ GET SINGLE PROMOTION
export const getPromotionService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid Promotion ID");

  const promotion = await PromotionModel.findById(id)
    .populate("allProducts specificProducts", "name price category")
    .exec();

  if (!promotion) throw new Error("Promotion not found");
  return promotion;
};

// ✅ GET ALL PROMOTIONS
export const getAllPromotionsService = async () => {
  return await PromotionModel.find()
    .sort({ createdAt: -1 })
    .populate("allProducts specificProducts", "name price category")
    .exec();
};

// ✅ UPDATE PROMOTION
export const updatePromotionService = async (
  id: string,
  payload: Partial<IPromotion>
) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid Promotion ID");

  const promotion = await PromotionModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!promotion) throw new Error("Promotion not found");
  return promotion;
};

// ✅ GET SELLER PROMOTIONS
export const getSellerPromotionsService = async (userId: string) => {
  // In real use, filter promotions by seller’s products
  return await PromotionModel.find(
    { isActive: true },
    {
      promotionName: 1,
      endDate: 1,
      discountValue: 1,
      isActive: 1,
      promotionType: 1,
    }
  ).sort({ endDate: 1 });
};
