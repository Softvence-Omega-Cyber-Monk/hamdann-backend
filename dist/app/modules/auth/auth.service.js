"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth_services = void 0;
const app_error_1 = require("../../utils/app_error");
const auth_schema_1 = require("./auth.schema");
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_schema_1 = require("../user/user.schema");
const JWT_1 = require("../../utils/JWT");
const configs_1 = require("../../configs");
const mail_sender_1 = __importDefault(require("../../utils/mail_sender"));
const isAccountExist_1 = require("../../utils/isAccountExist");
// login user
const login_user_from_db = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user by email and not deleted
    const user = yield user_schema_1.User_Model.findOne({
        email: payload.email,
        isDeleted: false,
    });
    if (!user) {
        throw new app_error_1.AppError("User not found", http_status_1.default.NOT_FOUND);
    }
    // Compare password
    const isPasswordMatch = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new app_error_1.AppError("Invalid password", http_status_1.default.UNAUTHORIZED);
    }
    // Generate tokens
    const accessToken = JWT_1.jwtHelpers.generateToken({
        userId: user._id,
        email: user.email,
        role: user.role,
    }, configs_1.configs.jwt.accessToken_secret, configs_1.configs.jwt.accessToken_expires);
    const refreshToken = JWT_1.jwtHelpers.generateToken({
        userId: user._id,
        email: user.email,
        role: user.role,
    }, configs_1.configs.jwt.refreshToken_secret, configs_1.configs.jwt.refreshToken_expires);
    return {
        accessToken,
        refreshToken,
        role: user.role,
    };
});
const refresh_token_from_db = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = JWT_1.jwtHelpers.verifyToken(token, configs_1.configs.jwt.refreshToken_secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = yield auth_schema_1.Account_Model.findOne({
        email: decodedData.email,
        status: "ACTIVE",
        isDeleted: false,
    });
    const accessToken = JWT_1.jwtHelpers.generateToken({
        email: userData === null || userData === void 0 ? void 0 : userData.email,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
    }, configs_1.configs.jwt.accessToken_secret, configs_1.configs.jwt.accessToken_expires);
    return accessToken;
});
const change_password_from_db = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistAccount = yield (0, isAccountExist_1.isAccountExist)(user === null || user === void 0 ? void 0 : user.email);
    if (!isExistAccount) {
        throw new app_error_1.AppError("Account not found", http_status_1.default.NOT_FOUND);
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, isExistAccount.password);
    // console.log("match pass",isCorrectPassword);
    if (!isCorrectPassword) {
        throw new app_error_1.AppError("Old password is incorrect", http_status_1.default.UNAUTHORIZED);
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    yield user_schema_1.User_Model.findOneAndUpdate({ email: isExistAccount.email }, {
        password: hashedPassword,
        updatedAt: new Date(),
    });
    return "Password changed successful.";
});
const forget_password_from_db = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isAccountExists = yield (0, isAccountExist_1.isAccountExist)(email);
    const resetToken = JWT_1.jwtHelpers.generateToken({
        email: isAccountExists.email,
        role: isAccountExists.role,
    }, configs_1.configs.jwt.resetToken_secret, configs_1.configs.jwt.resetToken_expires);
    const resetPasswordLink = `${configs_1.configs.jwt.front_end_url}/reset?token=${resetToken}&email=${isAccountExists.email}`;
    const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;
    yield (0, mail_sender_1.default)({
        to: email,
        subject: "Password reset successful!",
        textBody: "Your password is successfully reset.",
        htmlBody: emailTemplate,
    });
    return "Check your email for reset link";
});
exports.auth_services = {
    login_user_from_db,
    refresh_token_from_db,
    change_password_from_db,
    forget_password_from_db,
};
