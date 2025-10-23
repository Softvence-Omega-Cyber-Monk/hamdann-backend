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
const cloudinary_1 = require("../../utils/cloudinary");
const JWT_1 = require("../../utils/JWT");
const configs_1 = require("../../configs");
exports.user_service = {
    createUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("user data ", userData);
        // Check if email already exists
        const existingUser = yield user_schema_1.User_Model.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("Email already exists. Please use a different email.");
        }
        // Handle business logo upload if file exists
        if (userData.businessLogoFile) {
            try {
                // Generate unique filename
                const filename = `business-logo-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                // Upload business logo to Cloudinary
                const uploadResult = yield (0, cloudinary_1.uploadImgToCloudinary)(filename, userData.businessLogoFile.path, "business-logos");
                // Add the Cloudinary URL to userData
                userData.businessLogo = uploadResult.secure_url;
                // Remove the file property as we don't want to save it in the database
                delete userData.businessLogoFile;
            }
            catch (error) {
                console.error("Error uploading business logo:", error);
                throw new Error("Failed to upload business logo");
            }
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(userData === null || userData === void 0 ? void 0 : userData.password, 10);
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
    googleAuthLogin: (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        const userexit = yield user_schema_1.User_Model.findOne({ email: data.email });
        if (userexit) {
            const accessToken = JWT_1.jwtHelpers.generateToken({ userId: userexit === null || userexit === void 0 ? void 0 : userexit._id, email: userexit === null || userexit === void 0 ? void 0 : userexit.email, role: userexit === null || userexit === void 0 ? void 0 : userexit.role }, configs_1.configs === null || configs_1.configs === void 0 ? void 0 : configs_1.configs.jwt.accessToken_secret, configs_1.configs.jwt.accessToken_expires);
            const refreshToken = JWT_1.jwtHelpers.generateToken({ userId: userexit === null || userexit === void 0 ? void 0 : userexit._id, email: userexit === null || userexit === void 0 ? void 0 : userexit.email, role: userexit === null || userexit === void 0 ? void 0 : userexit.role }, configs_1.configs.jwt.refreshToken_secret, configs_1.configs.jwt.refreshToken_expires);
            console.log(accessToken, refreshToken);
            // 6️⃣ Return response
            return {
                message: 'User already exits',
                accessToken,
                refreshToken,
                role: userexit.role,
                userId: userexit._id,
            };
        }
        // console.log('user', user)
        const user = yield user_schema_1.User_Model.create(data);
        // console.log("res", res);
        const accessToken = JWT_1.jwtHelpers.generateToken({ userId: user === null || user === void 0 ? void 0 : user._id, email: user === null || user === void 0 ? void 0 : user.email, role: user === null || user === void 0 ? void 0 : user.role }, configs_1.configs === null || configs_1.configs === void 0 ? void 0 : configs_1.configs.jwt.accessToken_secret, configs_1.configs.jwt.accessToken_expires);
        const refreshToken = JWT_1.jwtHelpers.generateToken({ userId: user === null || user === void 0 ? void 0 : user._id, email: user === null || user === void 0 ? void 0 : user.email, role: user === null || user === void 0 ? void 0 : user.role }, configs_1.configs.jwt.refreshToken_secret, configs_1.configs.jwt.refreshToken_expires);
        console.log(accessToken, refreshToken);
        // 6️⃣ Return response
        return {
            accessToken,
            refreshToken,
            role: user.role,
            userId: user._id,
        };
    }),
    // Get all users
    getAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_schema_1.User_Model.find().sort({ createdAt: -1 }); // newest first
    }),
    myProfile: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_schema_1.User_Model.findOne({ _id: userId });
    }),
    // Update user
    updateUser: (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            throw new Error("Invalid user ID");
        // Check if the user exists
        const existingUser = yield user_schema_1.User_Model.findById(id);
        if (!existingUser)
            throw new Error("User not found");
        // FIX: Handle individual address fields from form-data
        const addressFields = ["state", "city", "zip", "streetAddress"];
        let hasAddressData = false;
        const newAddress = {};
        // Check if any address fields are present and non-empty
        addressFields.forEach((field) => {
            if (updateData[field] &&
                String(updateData[field]).trim() !== "") {
                newAddress[field] = updateData[field];
                hasAddressData = true;
                // Remove the individual field from updateData
                delete updateData[field];
            }
        });
        // If we have address data, structure it properly
        if (hasAddressData) {
            const existingUserObj = existingUser.toObject();
            updateData.address = Object.assign(Object.assign({}, (existingUserObj.address || {})), newAddress);
        }
        // Handle image upload if file exists
        if (updateData.profileImageFile) {
            try {
                // Upload image to Cloudinary
                const uploadResult = yield (0, cloudinary_1.uploadImgToCloudinary)(`user-${id}-${Date.now()}`, updateData.profileImageFile.path, "user-profiles");
                // Add the Cloudinary URL to updateData
                updateData.profileImage = uploadResult.secure_url;
                // Remove the file property as we don't want to save it in the database
                delete updateData.profileImageFile;
            }
            catch (error) {
                throw new Error("Failed to upload profile image");
            }
        }
        // Handle business logo upload if file exists
        if (updateData.businessLogoFile) {
            try {
                // Upload business logo to Cloudinary
                const uploadResult = yield (0, cloudinary_1.uploadImgToCloudinary)(`business-logo-${id}-${Date.now()}`, updateData.businessLogoFile.path, "business-logos");
                // Add the Cloudinary URL to updateData
                updateData.businessLogo = uploadResult.secure_url;
                // Remove the file property as we don't want to save it in the database
                delete updateData.businessLogoFile;
            }
            catch (error) {
                throw new Error("Failed to upload business logo");
            }
        }
        // Update user in database
        const updatedUser = yield user_schema_1.User_Model.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select("-password"); // Exclude password from response
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
    updateFcmToken: (userId, fcmToken) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = yield user_schema_1.User_Model.findByIdAndUpdate(userId, { fcmToken }, { new: true });
        if (!updatedUser)
            throw new Error("User not found");
        return updatedUser;
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
