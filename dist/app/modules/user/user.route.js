"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const cloudinary_1 = require("../../utils/cloudinary");
const userRoute = (0, express_1.Router)();
// Generic validation middleware
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.format() });
    }
    req.body = result.data;
    next();
};
// Create user
// userRoute.post("/create", validate(create_user), user_controllers.create_user);
userRoute.post("/create", cloudinary_1.upload.fields([
    { name: 'businessLogo', maxCount: 1 }
]), user_controller_1.user_controllers.create_user);
// Get single user by ID
userRoute.get("/get-single/:id", user_controller_1.user_controllers.get_single_user);
userRoute.post("/googleAuthLogin", user_controller_1.user_controllers.googleAuthLogin);
// Get all users
userRoute.get("/getAll", user_controller_1.user_controllers.get_all_users);
userRoute.get("/myProfile", (0, auth_1.default)("Admin", "Buyer", "Seller"), user_controller_1.user_controllers.myProfile);
// Update user
userRoute.put("/update/:id", cloudinary_1.upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'businessLogo', maxCount: 1 }
]), user_controller_1.user_controllers.update_single_user);
// Soft delete user
userRoute.put("/delete/:id", user_controller_1.user_controllers.delete_user);
// FCM TOKEN UPDATE
userRoute.put("/save-fcm-token", (0, auth_1.default)("Admin", "Buyer", "Seller"), user_controller_1.user_controllers.fcmTokenUpdate);
// PAYMENT METHODS ROUTES
// Add payment method
userRoute.post("/:userId/payment-method", user_controller_1.user_controllers.addPaymentMethod);
// Update payment method
userRoute.put("/:userId/payment-method/:paymentId", user_controller_1.user_controllers.updatePaymentMethod);
// Set default payment method
userRoute.patch("/:userId/payment-method/:paymentId/setDefault", user_controller_1.user_controllers.setDefaultPaymentMethod);
// Delete payment method
userRoute.delete("/:userId/payment-method/:paymentId", user_controller_1.user_controllers.deletePaymentMethod);
exports.default = userRoute;
