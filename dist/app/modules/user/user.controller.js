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
exports.user_controllers = void 0;
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const manage_response_1 = __importDefault(require("../../utils/manage_response"));
const user_service_1 = require("./user.service");
const http_status_1 = __importDefault(require("http-status"));
// const create_user = catchAsync(async (req, res) => {
//   const result = await user_service.createUser(req.body);
//   manageResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "User created successfully.",
//     data: result,
//   });
// });
const create_user = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const file = req.file;
    const files = req.files;
    // Prepare user data from form data
    const userData = Object.assign({}, req.body);
    // Handle business logo file (priority to multiple files, then single file)
    if ((_a = files === null || files === void 0 ? void 0 : files['businessLogo']) === null || _a === void 0 ? void 0 : _a[0]) {
        userData.businessLogoFile = files['businessLogo'][0];
    }
    else if (file) {
        userData.businessLogoFile = file;
    }
    // Parse any JSON fields if needed (like address, paymentMethods, etc.)
    if (userData.address && typeof userData.address === 'string') {
        try {
            userData.address = JSON.parse(userData.address);
        }
        catch (error) {
            // If parsing fails, keep as string or handle error
            console.warn('Failed to parse address field');
        }
    }
    if (userData.paymentMethods && typeof userData.paymentMethods === 'string') {
        try {
            userData.paymentMethods = JSON.parse(userData.paymentMethods);
        }
        catch (error) {
            console.warn('Failed to parse paymentMethods field');
        }
    }
    const result = yield user_service_1.user_service.createUser(userData);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "User created successfully.",
        data: result,
    });
}));
const get_single_user = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.user_service.getUserById(id);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User fetched successfully",
        data: result,
    });
}));
const get_all_users = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.user_service.getAllUsers();
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All users fetched successfully.",
        data: result,
    });
}));
const myProfile = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Request User:", req.user); // Debugging line to check req.user
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Assuming auth middleware sets req.user
    const result = yield user_service_1.user_service.myProfile(userId);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All users fetched successfully.",
        data: result,
    });
}));
const update_single_user = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    // Handle multiple file uploads
    const files = req.files;
    const profileImageFile = (_a = files === null || files === void 0 ? void 0 : files["profileImage"]) === null || _a === void 0 ? void 0 : _a[0];
    const businessLogoFile = (_b = files === null || files === void 0 ? void 0 : files["businessLogo"]) === null || _b === void 0 ? void 0 : _b[0];
    // Prepare update data
    const updateData = Object.assign({}, req.body);
    // Add files to update data if they exist
    if (profileImageFile) {
        updateData.profileImageFile = profileImageFile;
    }
    if (businessLogoFile) {
        updateData.businessLogoFile = businessLogoFile;
    }
    // Backward compatibility: if single file upload (from previous implementation)
    if (req.file && !profileImageFile && !businessLogoFile) {
        updateData.profileImageFile = req.file;
    }
    const result = yield user_service_1.user_service.updateUser(id, updateData);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User updated successfully.",
        data: result,
    });
}));
const delete_user = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.user_service.delete_user(id);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User deleted successfully (soft delete).",
        data: result,
    });
}));
const fcmTokenUpdate = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { fcmToken } = req.body;
    const result = yield user_service_1.user_service.updateFcmToken(userId, fcmToken);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "FCM token updated successfully.",
        data: result,
    });
}));
const addPaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const paymentData = req.body;
        const result = yield user_service_1.user_services.addPaymentMethodService(userId, paymentData);
        res.status(201).json({
            success: true,
            message: "Payment method added successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
// ✏️ Update payment method
const updatePaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, paymentId } = req.params;
        const result = yield user_service_1.user_services.updatePaymentMethodService(userId, paymentId, req.body);
        res.json({
            success: true,
            message: "Payment method updated",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
// 🌟 Set default payment method
const setDefaultPaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, paymentId } = req.params;
        const result = yield user_service_1.user_services.setDefaultPaymentMethodService(userId, paymentId);
        res.json({
            success: true,
            message: "Default payment method set",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
// ❌ Delete payment method
const deletePaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, paymentId } = req.params;
        const result = yield user_service_1.user_services.deletePaymentMethodService(userId, paymentId);
        res.json({
            success: true,
            message: "Payment method deleted",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.user_controllers = {
    create_user,
    get_single_user,
    get_all_users,
    myProfile,
    update_single_user,
    delete_user,
    fcmTokenUpdate,
    addPaymentMethod,
    updatePaymentMethod,
    setDefaultPaymentMethod,
    deletePaymentMethod,
};
