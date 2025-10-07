import { z } from "zod";

export const CreatePromotionSchema = z.object({
  promotionName: z.string(),
  promotionType: z.enum(["percentage", "fixed"]),

  // Convert string to number automatically
  discountValue: z.preprocess(val => Number(val), z.number().min(0)),
  minimumPurchase: z.preprocess(val => Number(val), z.number().min(0)),

  // Convert JSON string to array
  allProducts: z.preprocess(val => {
    if (typeof val === "string") return JSON.parse(val);
    return val;
  }, z.array(z.string()).optional()),

  specificProducts: z.preprocess(val => {
    if (typeof val === "string") return JSON.parse(val);
    return val;
  }, z.array(z.string()).optional()),

  ProductsCategories: z.preprocess(val => {
    if (typeof val === "string") return JSON.parse(val);
    return val;
  }, z.array(z.string()).optional()),

  startDate: z.string(),
  endDate: z.string(),

  termsAndConditions: z.string().optional(),

  isActive: z.preprocess(val => val === "true", z.boolean().optional()),
});

// Update Promotion Validation Schema
export const UpdatePromotionSchema = CreatePromotionSchema.partial();