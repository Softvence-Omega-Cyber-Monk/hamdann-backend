"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePromotionSchema = exports.CreatePromotionSchema = void 0;
const zod_1 = require("zod");
exports.CreatePromotionSchema = zod_1.z.object({
    // ✅ required fields
    sellerId: zod_1.z.string(),
    promotionName: zod_1.z.string(),
    promotionType: zod_1.z.enum(["percentage", "fixed"]),
    // ✅ numeric fields (convert from form-data string to number)
    discountValue: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().min(0)),
    minimumPurchase: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().min(0)),
    // ✅ applicable type (new)
    applicableType: zod_1.z.enum([
        "allProducts",
        "specificProducts",
        "productCategories",
    ]),
    // ✅ JSON string to array conversions
    allProducts: zod_1.z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "")
            return JSON.parse(val);
        return Array.isArray(val) ? val : [];
    }, zod_1.z.array(zod_1.z.string()).optional()),
    specificProducts: zod_1.z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "")
            return JSON.parse(val);
        return Array.isArray(val) ? val : [];
    }, zod_1.z.array(zod_1.z.string()).optional()),
    productCategories: zod_1.z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "")
            return JSON.parse(val);
        return Array.isArray(val) ? val : [];
    }, zod_1.z.array(zod_1.z.string()).optional()),
    // ✅ Dates from form-data are strings
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    // ✅ Optional fields
    termsAndConditions: zod_1.z.string().optional(),
    isActive: zod_1.z.preprocess((val) => val === "true", zod_1.z.boolean().optional()),
});
// ✅ Update schema — all fields optional
exports.UpdatePromotionSchema = exports.CreatePromotionSchema.partial();
