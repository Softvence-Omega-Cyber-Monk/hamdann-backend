"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_user = exports.create_user = void 0;
const zod_1 = require("zod");
// Create user schema
exports.create_user = zod_1.z
    .object({
    role: zod_1.z.enum(["Admin", "Buyer", "Seller"]),
    name: zod_1.z.string().min(2, "Name is required"),
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod_1.z.string().min(6),
    fcmToken: zod_1.z.string().optional(),
    address: zod_1.z
        .object({
        state: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        zip: zod_1.z.string().optional(),
        streetAddress: zod_1.z.string().optional(),
    })
        .optional(),
    paymentMethods: zod_1.z
        .array(zod_1.z.object({
        _id: zod_1.z.string().optional(),
        method: zod_1.z.string().optional(),
        cardNumber: zod_1.z.number().optional(),
        expiryDate: zod_1.z.string().optional(),
        cvv: zod_1.z.number().optional(),
        isDefault: zod_1.z.boolean().optional(),
    }))
        .optional(),
    preferences: zod_1.z.enum(["Fashion", "Food", "Beauty", "Perfume"]).optional(),
    businessInfo: zod_1.z
        .object({
        businessName: zod_1.z.string().optional(),
        businessType: zod_1.z.string().optional(),
        businessDescription: zod_1.z.string().optional(),
        country: zod_1.z.string().optional(),
        phoneNumber: zod_1.z.string().optional(),
        businessLogo: zod_1.z.string().optional(),
    })
        .optional(),
    isPaidPlan: zod_1.z.boolean().optional(),
    subscribtionPlan: zod_1.z.enum(["basic", "professional", "premium"]).optional(),
    deviceToken: zod_1.z.string().optional(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
// Update user schema
exports.update_user = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    address: zod_1.z
        .object({
        state: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        zip: zod_1.z.string().optional(),
        streetAddress: zod_1.z.string().optional(),
    })
        .optional(),
    preferences: zod_1.z.enum(["Fashion", "Food", "Beauty", "Perfume"]).optional(),
    businessInfo: zod_1.z
        .object({
        businessName: zod_1.z.string().optional(),
        businessType: zod_1.z.string().optional(),
        businessDescription: zod_1.z.string().optional(),
        country: zod_1.z.string().optional(),
        phoneNumber: zod_1.z.string().optional(),
        businessLogo: zod_1.z.string().optional(),
    })
        .optional(),
    paymentMethods: zod_1.z
        .array(zod_1.z.object({
        _id: zod_1.z.string().optional(),
        method: zod_1.z.string().optional(),
        cardNumber: zod_1.z.string().optional(),
        expiryDate: zod_1.z.string().optional(),
        cvv: zod_1.z.string().optional(),
        isDefault: zod_1.z.boolean().optional(),
    }))
        .optional(),
    profileImage: zod_1.z.string().optional(),
    businessLogo: zod_1.z.string().optional(),
    subscribtionPlan: zod_1.z.enum(["basic", "professional", "premium"]).optional(),
});
