"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Model = void 0;
const mongoose_1 = require("mongoose");
const user_schema = new mongoose_1.Schema({
    role: {
        type: String,
        trim: true,
        enum: ["Admin", "Buyer", "Seller"],
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    address: {
        state: { type: String },
        city: { type: String },
        zip: { type: String },
        streetAddress: { type: String },
    },
    paymentMethod: [
        {
            method: { type: String },
            cardNumber: { type: String },
            expiryDate: { type: String },
            cvv: { type: Number },
        },
    ],
    Preferences: {
        type: String,
        trim: true,
        enum: ["Fashion", "Food", "Beauty", "Perfume"],
    },
    businessInfo: {
        businessName: { type: String },
        businesswType: { type: String },
        businessDescription: { type: String },
        country: { type: String },
        phoneNumber: { type: String },
        businessLogo: { type: String },
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.User_Model = (0, mongoose_1.model)("user", user_schema);
