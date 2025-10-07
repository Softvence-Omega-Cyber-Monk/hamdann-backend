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
exports.user_services = exports.user_service = void 0;
const user_schema_1 = require("./user.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
exports.user_service = {
    createUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if email already exists
        const existingUser = yield user_schema_1.User_Model.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("Email already exists. Please use a different email.");
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
        const user = new user_schema_1.User_Model(Object.assign(Object.assign({}, userData), { password: hashedPassword, confirmPassword: hashedPassword }));
        return yield user.save();
    }),
    // Get single user by ID
    getUserById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_schema_1.User_Model.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }),
    // Get all users
    getAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_schema_1.User_Model.find().sort({ createdAt: -1 }); // newest first
    }),
    // Update user (only name, email, address, paymentMethod)
    updateUser: (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            throw new Error("Invalid user ID");
        // Check if the user exists
        const existingUser = yield user_schema_1.User_Model.findById(id);
        if (!existingUser)
            throw new Error("User not found");
        // If updating email, check if it's already used by another user
        if (updateData.email) {
            const emailExists = yield user_schema_1.User_Model.findOne({
                email: updateData.email,
                _id: { $ne: id }, // exclude the current user
            });
            if (emailExists)
                throw new Error("Email already in use by another user");
        }
        console.log("updateData:", updateData);
        // Update user and return updated document
        const updatedUser = yield user_schema_1.User_Model.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser)
            throw new Error("Failed to update user");
        return updatedUser;
    }),
    delete_user: (id) => __awaiter(void 0, void 0, void 0, function* () {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            throw new Error("Invalid user ID");
        // Set isDeleted: true
        const user = yield user_schema_1.User_Model.findByIdAndUpdate(id, { isDeleted: true }, { new: true } // return the updated document
        );
        if (!user)
            throw new Error("User not found");
        return user;
    }),
};
// 🟢 Add new payment method
const addPaymentMethodService = (userId, paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.User_Model.findById(userId);
    if (!user)
        throw new Error("User not found");
    user.paymentMethods = user.paymentMethods || [];
    user.paymentMethods.push(paymentData);
    yield user.save();
    yield user.save();
    return user;
});
// 🟡 Update specific payment method
const updatePaymentMethodService = (userId, paymentId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_schema_1.User_Model.findOneAndUpdate({ _id: userId, "paymentMethods._id": paymentId }, {
        $set: {
            "paymentMethods.$.method": updateData.method,
            "paymentMethods.$.cardNumber": updateData.cardNumber,
            "paymentMethods.$.expiryDate": updateData.expiryDate,
            "paymentMethods.$.cvv": updateData.cvv,
        },
    }, { new: true });
    if (!updatedUser)
        throw new Error("Payment method not found");
    return updatedUser;
});
// 🟠 Set one payment method as default
const setDefaultPaymentMethodService = (userId, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: unset all defaults
    yield user_schema_1.User_Model.updateOne({ _id: userId }, { $set: { "paymentMethods.$[].isDefault": false } });
    // Step 2: set selected as default
    const updatedUser = yield user_schema_1.User_Model.findOneAndUpdate({ _id: userId, "paymentMethods._id": paymentId }, { $set: { "paymentMethods.$.isDefault": true } }, { new: true });
    if (!updatedUser)
        throw new Error("Payment method not found");
    return updatedUser;
});
// 🔴 Delete a payment method
const deletePaymentMethodService = (userId, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_schema_1.User_Model.findByIdAndUpdate(userId, { $pull: { paymentMethods: { _id: paymentId } } }, { new: true });
    if (!updatedUser)
        throw new Error("Payment method not found");
    return updatedUser;
});
exports.user_services = {
    user_service: exports.user_service,
    addPaymentMethodService,
    updatePaymentMethodService,
    setDefaultPaymentMethodService,
    deletePaymentMethodService,
};
