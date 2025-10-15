import { IPromotion } from "./promotion.interface";
import { PromotionModel } from "./promotion.model";
import { Product } from "../products/products.model";
import mongoose from "mongoose";

// ✅ CREATE PROMOTION SERVICE
export const createPromotionService = async (payload: IPromotion) => {
  let productIds: any[] = [];

  if (payload.applicableType === "allProducts") {
    productIds = await Product.find({}, "_id");
    payload.allProducts = productIds.map((p) => p._id);
  }

  if (
    payload.applicableType === "productCategories" &&
    payload.productCategories?.length
  ) {
    const categoryProducts = await Product.find(
      { category: { $in: payload.productCategories } },
      "_id"
    );
    payload.allProducts = categoryProducts.map((p) => p._id);
  }

  if (
    payload.applicableType === "specificProducts" &&
    payload.specificProducts?.length
  ) {
    payload.allProducts = payload.specificProducts;
  }

  const promotion = await PromotionModel.create(payload);
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
