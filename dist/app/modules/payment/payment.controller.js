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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const payment_service_1 = require("./payment.service");
const stripe_config_1 = require("../../configs/stripe.config");
const payment_model_1 = require("./payment.model");
const order_model_1 = require("../order/order.model");
const user_schema_1 = require("../user/user.schema");
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        const url = yield (0, payment_service_1.createCheckoutSessionService)(orderId);
        res.status(200).json({ success: true, url });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { session_id } = req.query;
        if (!session_id) {
            return res.status(400).json({ success: false, message: "Session ID required" });
        }
        const session = yield stripe_config_1.stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === "paid") {
            // Update payment status
            const payment = yield payment_model_1.Payment.findOneAndUpdate({ paymentIntentId: session.id }, { paymentStatus: "succeeded" }, { new: true });
            // Populate order details
            const orderId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderId;
            const order = yield order_model_1.Order.findById(orderId)
                .populate({
                path: "items.productId", // assuming order.items.productId references Product model
                select: "name price", // choose what fields you want
            })
                .exec();
            return res.status(200).json({
                success: true,
                message: "Payment successful",
                payment,
                order, // populated order with product details
            });
        }
        res.status(200).json({ success: false, message: "Payment not completed", session });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// Subscription controller
const createSubscriptionSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, plan } = req.body;
        // console.log(userId, 'lksdlfjsdklf -----------------')
        const isUserExist = yield user_schema_1.User_Model.findById(userId);
        if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) !== 'Seller') {
            throw new Error('Only the Seller can buy the subscription');
        }
        if (!userId || !plan) {
            return res.status(400).json({
                success: false,
                message: "userId and plan are required",
            });
        }
        const url = yield (0, payment_service_1.createSubscriptionSessionService)(userId, plan);
        res.status(200).json({ success: true, url });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
const verifySubscriptionPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required",
            });
        }
        const result = yield (0, payment_service_1.verifySubscriptionPaymentService)(session_id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.paymentController = {
    createCheckoutSession,
    verifyPayment,
    createSubscriptionSession,
    verifySubscriptionPayment,
};
