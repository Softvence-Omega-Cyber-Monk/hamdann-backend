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
exports.auth_services = exports.resetPassword = exports.verifyResetCode = exports.requestPasswordReset = exports.logoutRemoveToken = exports.login_user_from_db = void 0;
const app_error_1 = require("../../utils/app_error");
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_schema_1 = require("../user/user.schema");
const JWT_1 = require("../../utils/JWT");
const configs_1 = require("../../configs");
const isAccountExist_1 = require("../../utils/isAccountExist");
const sendEmailForCode_1 = require("../../utils/sendEmailForCode");
const auth_schema_1 = require("./auth.schema");
// login user
const login_user_from_db = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("device token:", payload.deviceToken);
    // 1️⃣ Find the user
    const user = yield user_schema_1.User_Model.findOne({
        email: payload.email,
        isDeleted: false,
    });
    if (!user) {
        throw new app_error_1.AppError("User not found", http_status_1.default.NOT_FOUND);
    }
    // 2️⃣ Check password
    const isPasswordMatch = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new app_error_1.AppError("Invalid password", http_status_1.default.UNAUTHORIZED);
    }
    // 3️⃣ Check device limit based on plan
    const singleDevicePlans = ["starter", "starterYearly"];
    const multiDevicePlans = ["advanced", "advancedYearly"];
    if (singleDevicePlans.includes(user === null || user === void 0 ? void 0 : user.subscribtionPlan)) {
        // Single-device restriction
        if (user.deviceToken && user.deviceToken !== payload.deviceToken) {
            throw new app_error_1.AppError("Your account is already logged in on another device. Please logout from that device first.", http_status_1.default.FORBIDDEN);
        }
        // Save new deviceToken if not set yet
        if (!user.deviceToken) {
            user.deviceToken = payload.deviceToken;
            yield user.save();
        }
    }
    // 4️⃣ For multi-device plans, optionally track devices (optional)
    if (multiDevicePlans.includes(user.subscribtionPlan)) {
        if (!user.deviceTokens)
            user.deviceTokens = [];
        // Store up to 5 recent devices
        if (!user.deviceTokens.includes(payload.deviceToken)) {
            user.deviceTokens.push(payload.deviceToken);
            if (user.deviceTokens.length > 5)
                user.deviceTokens.shift(); // keep last 5
            yield user.save();
        }
    }
    // 5️⃣ Generate tokens
    const accessToken = JWT_1.jwtHelpers.generateToken({ userId: user._id, email: user.email, role: user.role }, configs_1.configs === null || configs_1.configs === void 0 ? void 0 : configs_1.configs.jwt.accessToken_secret, configs_1.configs.jwt.accessToken_expires);
    const refreshToken = JWT_1.jwtHelpers.generateToken({ userId: user._id, email: user.email, role: user.role }, configs_1.configs.jwt.refreshToken_secret, configs_1.configs.jwt.refreshToken_expires);
    // 6️⃣ Return response
    return {
        accessToken,
        refreshToken,
        role: user.role,
        userId: user._id,
        isPaidPlan: user.isPaidPlan || false,
        subscribtionPlan: user.subscribtionPlan || null,
    };
});
exports.login_user_from_db = login_user_from_db;
const refresh_token_from_db = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = JWT_1.jwtHelpers.verifyToken(token, configs_1.configs.jwt.refreshToken_secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = yield user_schema_1.User_Model.findOne({
        email: decodedData.email,
        isDeleted: false,
    });
    const accessToken = JWT_1.jwtHelpers.generateToken({ userId: userData === null || userData === void 0 ? void 0 : userData._id, email: userData === null || userData === void 0 ? void 0 : userData.email, role: userData === null || userData === void 0 ? void 0 : userData.role }, configs_1.configs === null || configs_1.configs === void 0 ? void 0 : configs_1.configs.jwt.accessToken_secret, configs_1.configs.jwt.accessToken_expires);
    return { accessToken };
});
const change_password_from_db = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistAccount = yield (0, isAccountExist_1.isAccountExist)(user === null || user === void 0 ? void 0 : user.email);
    if (!isExistAccount) {
        throw new app_error_1.AppError("Account not found", http_status_1.default.NOT_FOUND);
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, isExistAccount === null || isExistAccount === void 0 ? void 0 : isExistAccount.password);
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
const logoutRemoveToken = (userId, deviceToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.User_Model.findById(userId);
    if (!user)
        throw new app_error_1.AppError("User not found", http_status_1.default.NOT_FOUND);
    const singleDevicePlans = ["starter", "starterYearly"];
    const multiDevicePlans = ["advanced", "advancedYearly"];
    if (singleDevicePlans.includes(user === null || user === void 0 ? void 0 : user.subscribtionPlan)) {
        user.deviceToken = null;
    }
    else if (multiDevicePlans.includes(user.subscribtionPlan)) {
        user.deviceTokens = user.deviceTokens.filter((token) => token !== deviceToken);
    }
    yield user.save();
    return { message: "Logged out successfully" };
});
exports.logoutRemoveToken = logoutRemoveToken;
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.User_Model.findOne({ email });
    if (!user)
        throw new Error("User not found");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // Remove old code if exists
    yield auth_schema_1.passwordResetModel.deleteMany({ email });
    // Store new code
    yield auth_schema_1.passwordResetModel.create({ email, code, expiresAt });
    yield (0, sendEmailForCode_1.sendEmailForCode)({
        to: email,
        subject: "Your Password Reset Code",
        text: `Your password reset code is ${code}. It will expire in 10 minutes.`,
    });
    console.log(email, code, "====="); // for debug
    return { email };
});
exports.requestPasswordReset = requestPasswordReset;
const verifyResetCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = yield auth_schema_1.passwordResetModel.findOne({ email });
    console.log(entry, 'entry--------');
    if (!entry)
        throw new Error("No reset code found. Please request again.");
    if (entry.expiresAt.getTime() < Date.now()) {
        yield auth_schema_1.passwordResetModel.deleteOne({ email });
        throw new Error("Reset code expired. Please request again.");
    }
    // if (entry.code !== code) throw new Error("Invalid reset code.");
    return { verified: true };
});
exports.verifyResetCode = verifyResetCode;
const resetPassword = (email, code, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = yield auth_schema_1.passwordResetModel.findOne({ email });
    console.log('reset password', entry);
    // if (!entry || entry.code !== code)
    //   throw new Error("Invalid or expired reset code.");
    const user = yield user_schema_1.User_Model.findOne({ email });
    if (!user)
        throw new Error("User not found");
    const hashed = yield bcrypt_1.default.hash(newPassword, 10);
    user.password = hashed;
    yield user.save();
    yield auth_schema_1.passwordResetModel.deleteOne({ email });
});
exports.resetPassword = resetPassword;
exports.auth_services = {
    login_user_from_db: exports.login_user_from_db,
    refresh_token_from_db,
    change_password_from_db,
    // forget_password_from_db,
    logoutRemoveToken: exports.logoutRemoveToken,
    requestPasswordReset: exports.requestPasswordReset,
    verifyResetCode: exports.verifyResetCode,
    resetPassword: exports.resetPassword,
};
