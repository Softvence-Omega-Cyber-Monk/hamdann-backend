"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionModel = void 0;
const mongoose_1 = require("mongoose");
const PromotionSchema = new mongoose_1.Schema({
    sellerId: { type: String, required: true },
    promotionImage: { type: String, required: true },
    promotionName: { type: String, required: true },
    promotionType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
    },
    discountValue: { type: Number, required: true },
    minimumPurchase: { type: Number, required: true },
    applicableType: {
        type: String,
        enum: ["allProducts", "specificProducts", "productCategories"],
        required: true,
    },
    allProducts: [{ type: mongoose_1.Types.ObjectId, ref: "Product" }],
    specificProducts: [{ type: mongoose_1.Types.ObjectId, ref: "Product" }],
    productCategories: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    termsAndConditions: { type: String },
    isActive: { type: Boolean, default: true },
    totalView: { type: Number, default: 0 },
    totalClick: { type: Number, default: 0 },
    redemptionRate: { type: String },
    conversionRate: { type: String },
}, { timestamps: true });
// Automatically deactivate expired promotions
PromotionSchema.pre("save", function (next) {
    const now = new Date();
    if (this.endDate < now) {
        this.isActive = false;
    }
    next();
});
exports.PromotionModel = (0, mongoose_1.model)("Promotion", PromotionSchema);
