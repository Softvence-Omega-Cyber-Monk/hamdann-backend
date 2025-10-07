"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
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
userRoute.post("/create", validate(user_validation_1.create_user), user_controller_1.user_controllers.create_user);
// Get single user by ID
userRoute.get("/get-single/:id", user_controller_1.user_controllers.get_single_user);
// Get all users
userRoute.get("/getAll", user_controller_1.user_controllers.get_all_users);
// Update user
userRoute.put("/update/:id", validate(user_validation_1.update_user), user_controller_1.user_controllers.update_single_user);
// Soft delete user
userRoute.put("/delete/:id", user_controller_1.user_controllers.delete_user);
exports.default = userRoute;
