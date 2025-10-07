"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionModel = void 0;
const mongoose_1 = require("mongoose");
const PromotionSchema = new mongoose_1.Schema({
    promotionImage: { type: String, required: true },
    promotionName: { type: String, required: true },
    promotionType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
    },
    discountValue: { type: Number, required: true },
    minimumPurchase: { type: Number, required: true },
    allProducts: [{ type: mongoose_1.Types.ObjectId, ref: "Product" }],
    specificProducts: [{ type: mongoose_1.Types.ObjectId, ref: "Product" }],
    ProductsCategories: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    termsAndConditions: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.PromotionModel = (0, mongoose_1.model)("Promotion", PromotionSchema);
