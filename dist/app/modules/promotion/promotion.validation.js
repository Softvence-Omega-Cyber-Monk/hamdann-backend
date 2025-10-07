"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePromotionSchema = exports.CreatePromotionSchema = void 0;
const zod_1 = require("zod");
exports.CreatePromotionSchema = zod_1.z.object({
    promotionName: zod_1.z.string(),
    promotionType: zod_1.z.enum(["percentage", "fixed"]),
    // Convert string to number automatically
    discountValue: zod_1.z.preprocess(val => Number(val), zod_1.z.number().min(0)),
    minimumPurchase: zod_1.z.preprocess(val => Number(val), zod_1.z.number().min(0)),
    // Convert JSON string to array
    allProducts: zod_1.z.preprocess(val => {
        if (typeof val === "string")
            return JSON.parse(val);
        return val;
    }, zod_1.z.array(zod_1.z.string()).optional()),
    specificProducts: zod_1.z.preprocess(val => {
        if (typeof val === "string")
            return JSON.parse(val);
        return val;
    }, zod_1.z.array(zod_1.z.string()).optional()),
    ProductsCategories: zod_1.z.preprocess(val => {
        if (typeof val === "string")
            return JSON.parse(val);
        return val;
    }, zod_1.z.array(zod_1.z.string()).optional()),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    termsAndConditions: zod_1.z.string().optional(),
    isActive: zod_1.z.preprocess(val => val === "true", zod_1.z.boolean().optional()),
});
// Update Promotion Validation Schema
exports.UpdatePromotionSchema = exports.CreatePromotionSchema.partial();
