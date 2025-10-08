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
const create_user = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.user_service.createUser(req.body);
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
const update_single_user = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.user_service.updateUser(id, req.body);
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
        res.json({ success: true, message: "Payment method updated", data: result });
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
        res.json({ success: true, message: "Default payment method set", data: result });
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
        res.json({ success: true, message: "Payment method deleted", data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.user_controllers = {
    create_user,
    get_single_user,
    get_all_users,
    update_single_user,
    delete_user,
    addPaymentMethod,
    updatePaymentMethod,
    setDefaultPaymentMethod,
    deletePaymentMethod
};
