"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_user = exports.create_user = void 0;
// Create user schema (already exists)
const zod_1 = require("zod");
exports.create_user = zod_1.z
    .object({
    role: zod_1.z.enum(["Admin", "Buyer", "Saler"]),
    name: zod_1.z.string().min(2, "Name is required"),
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod_1.z.string().min(6),
    address: zod_1.z
        .object({
        state: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        zip: zod_1.z.string().optional(),
        streetAddress: zod_1.z.string().optional(),
    })
        .optional(),
    paymentMethod: zod_1.z
        .object({
        method: zod_1.z.string().optional(),
        cardNumber: zod_1.z.string().optional(),
        expiryDate: zod_1.z.string().optional(),
        cvv: zod_1.z.number().optional(),
    })
        .optional(),
    Preferences: zod_1.z.enum(["Fashion", "Food", "Beauty", "Perfume"]).optional(),
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
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
// ✅ Update user schema
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
    Preferences: zod_1.z.enum(["Fashion", "Food", "Beauty", "Perfume"]).optional(),
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
    paymentMethod: zod_1.z
        .object({
        method: zod_1.z.string().optional(),
        cardNumber: zod_1.z.string().optional(),
        expiryDate: zod_1.z.coerce.date().optional(),
        cvv: zod_1.z.number().optional(),
    })
        .optional(),
});
