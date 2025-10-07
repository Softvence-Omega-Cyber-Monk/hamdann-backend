"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const authRoute = (0, express_1.Router)();
authRoute.post("/login", auth_controller_1.auth_controllers.login_user);
authRoute.post('/refresh-token', auth_controller_1.auth_controllers.refresh_token);
authRoute.post('/change-password', (0, auth_1.default)("Buyer", "Seller", "Admin"), auth_controller_1.auth_controllers.change_password);
authRoute.post('/forgot-password', 
// RequestValidator(auth_validation.forgotPassword),
auth_controller_1.auth_controllers.forget_password);
exports.default = authRoute;
