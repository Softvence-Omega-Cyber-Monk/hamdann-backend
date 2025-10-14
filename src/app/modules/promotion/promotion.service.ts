import { IPromotion } from "./promotion.interface";
import { PromotionModel } from "./promotion.model";
import { Product } from "../products/products.model"; // Import your Product model
import mongoose from "mongoose";
import { sendNotification } from "../../utils/notificationHelper";

// Create a promotion
export const createPromotionService = async (payload: IPromotion) => {
  // Optional: validate product IDs exist
  if (payload.allProducts?.length) {
    const existing = await Product.find({ _id: { $in: payload.allProducts } });

    if (existing.length !== payload.allProducts.length) {
      throw new Error("Some products in allProducts do not exist");
    }
  }
  if (payload.specificProducts?.length) {
    const existing = await Product.find({
      _id: { $in: payload.specificProducts },
    });
    if (existing.length !== payload.specificProducts.length) {
      throw new Error("Some products in specificProducts do not exist");
    }
  }

  const promotion = await PromotionModel.create(payload);


    // const customers = await User_Model.find({ role: "Buyer" });
    // for (const buyer of customers) {
    //   await sendNotification(
    //     buyer._id.toString(),
    //     "🛒 New Order Added!",
    //     ` is now available!`
    //   );
    // }



  return promotion;
};

// Get single promotion by ID
export const getPromotionService = async (
  id: string
): Promise<IPromotion | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Promotion ID");
  }

  const promotion = await PromotionModel.findById(id)
    .populate("allProducts", "specificProducts")
    .exec();
  if (!promotion) {
    throw new Error("Promotion not found");
  }

  return promotion;
};

// Get all promotions
export const getAllPromotionsService = async () => {
  // console.log("Service hit ")
  // No try-catch needed; let controller handle errors
  const promotion = await PromotionModel.find()
    .sort({ createdAt: -1 })
    .populate("allProducts", "specificProducts")
    .exec();

  //   console.log("Promotion", promotion);
  return promotion;
};

// ✅ Update promotion
export const updatePromotionService = async (
  id: string,
  payload: Partial<IPromotion>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Promotion ID");
  }

  const promotion = await PromotionModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!promotion) {
    throw new Error("Promotion not found");
  }

  return promotion;
};

// Inventory status
export const getSellerPromotionsService = async (userId: string) => {
  // Get all promotions that are active and return required fields
  const promotions = await PromotionModel.find(
    { isActive: true },
    { 
      promotionName: 1, 
      endDate: 1, 
      discountValue: 1, 
      isActive: 1,
      promotionType: 1,
      _id: 1
    }
  ).sort({ endDate: 1 });

  return promotions;
};
