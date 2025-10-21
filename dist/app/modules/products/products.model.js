"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sku: { type: String, required: true, unique: true, trim: true },
    category: {
        type: String,
        required: true,
    },
    brand: { type: String, trim: true },
    shopName: { type: String, trim: true, default: null },
    weight: { type: Number },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male",
    },
    availableSizes: [{ type: String }],
    availableColors: [{ type: String }],
    variations: [{ type: String }], // e.g., ["Red - M", "Blue - L"]
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    newPrice: { type: Number },
    discountType: {
        type: String,
        enum: ["percentage", "fixed", null],
        default: null,
    },
    discountValue: { type: Number, default: 0 },
    reviews: [
        {
            userId: { type: String, required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String },
        },
    ],
    averageRating: { type: Number, default: 0 },
    shopReviews: { type: Number, default: null },
    productImages: [{ type: String, required: true }],
    salesCount: { type: Number, default: 0 }, // Flag for best-selling
    isNewArrival: { type: Boolean, default: false }, // Flag for new arrival
    isWishlisted: { type: Boolean, default: false }, // Flag for wishlist
}, { timestamps: true });
exports.Product = mongoose_1.default.model("Product", ProductSchema);
