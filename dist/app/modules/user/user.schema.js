"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Model = void 0;
const mongoose_1 = require("mongoose");
// Sub-schema for Payment Methods
const PaymentMethodSchema = new mongoose_1.Schema({
    method: {
        type: String,
        required: true,
        enum: ["Visa", "Mastercard", "PayPal", "Bank Transfer"], // extendable
    },
    cardNumber: { type: Number, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
}, { _id: true } // 👈 ensures each payment method gets its own ObjectId (paymentId)
);
// Sub-schema for Address
const AddressSchema = new mongoose_1.Schema({
    state: { type: String },
    city: { type: String },
    zip: { type: String },
    streetAddress: { type: String },
}, { _id: false });
// Sub-schema for Business Info
const BusinessInfoSchema = new mongoose_1.Schema({
    businessName: { type: String },
    businessType: { type: String },
    businessDescription: { type: String },
    country: { type: String },
    phoneNumber: { type: String },
    businessLogo: { type: String },
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
    role: { type: String, required: true, enum: ["Admin", "Buyer", "Seller"] },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    fcmToken: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    address: { type: AddressSchema, default: {} },
    paymentMethods: {
        type: [PaymentMethodSchema],
        default: [],
    },
    preferences: {
        type: String,
        trim: true,
        enum: ["Fashion", "Food", "Beauty", "Perfume"],
    },
    businessInfo: { type: BusinessInfoSchema, default: {} },
    profileImage: {
        type: String,
        default: "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg",
    },
    isPaidPlan: { type: Boolean, default: false },
}, {
    versionKey: false,
    timestamps: true,
});
exports.User_Model = (0, mongoose_1.model)("User", UserSchema);
