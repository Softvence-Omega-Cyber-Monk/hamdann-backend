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
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OrderItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
}, { _id: false });
const OrderStatusDatesSchema = new mongoose_1.Schema({
    placedAt: { type: Date },
    paymentProcessedAt: { type: Date },
    shippedAt: { type: Date },
    outForDeliveryAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
}, { _id: false });
const ShippingAddressSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
}, { _id: false });
const PaymentInfoSchema = new mongoose_1.Schema({
    cardLast4: { type: String },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    paymentDate: { type: Date },
    transactionId: { type: String },
}, { _id: false });
const generateOrderNumber = () => {
    const datePart = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .slice(0, 8); // YYYYMMDD
    const randomPart = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    return `ORD-${datePart}-${randomPart}`;
};
const OrderSchema = new mongoose_1.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        default: generateOrderNumber,
    },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true, default: "AED" },
    paymentMethod: { type: String, required: true, default: "Stripe" },
    paymentInfo: { type: PaymentInfoSchema, default: {} },
    status: {
        type: String,
        enum: [
            "placed",
            "payment_processed",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled",
            "returned"
        ],
        default: "placed",
    },
    contactInfo: {
        email: { type: String, required: true },
        phone: { type: String },
    },
    statusDates: {
        type: OrderStatusDatesSchema,
        default: { placedAt: new Date() },
    },
    shippingAddress: { type: ShippingAddressSchema, required: true },
}, { timestamps: true });
exports.Order = mongoose_1.default.model("Order", OrderSchema);
