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
exports.verifySubscriptionPaymentService = exports.createSubscriptionSessionService = exports.createCheckoutSessionService = void 0;
const stripe_config_1 = require("../../configs/stripe.config");
const configs_1 = require("../../configs");
const payment_model_1 = require("./payment.model");
const user_schema_1 = require("../user/user.schema");
const order_model_1 = require("../order/order.model");
const createCheckoutSessionService = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const orderAmount = yield order_model_1.Order.findById(orderId);
    const session = yield stripe_config_1.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "aed",
                    product_data: { name: `Order #${orderId}` },
                    unit_amount: Math.round((orderAmount === null || orderAmount === void 0 ? void 0 : orderAmount.totalAmount) * 100),
                },
                quantity: 1,
            },
        ],
        success_url: `${configs_1.configs.jwt.front_end_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${configs_1.configs.jwt.front_end_url}/payment-failed`,
        metadata: { orderId },
    });
    //  console.log("session", session);
    // store pending payment
    yield payment_model_1.Payment.create({
        orderId,
        amount: orderAmount === null || orderAmount === void 0 ? void 0 : orderAmount.totalAmount,
        currency: "aed",
        paymentIntentId: session.id,
        paymentStatus: "pending",
        mode: "payment",
    });
    return session.url;
});
exports.createCheckoutSessionService = createCheckoutSessionService;
// Subscription service
const createSubscriptionSessionService = (userId, plan) => __awaiter(void 0, void 0, void 0, function* () {
    // 💰 Plan pricing
    const planPrices = {
        basic: 1999,
        professional: 4999,
        premium: 9999,
    };
    const amount = planPrices[plan];
    // ✅ Create Stripe Checkout Session
    const session = yield stripe_config_1.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment", // not recurring (for simplicity)
        line_items: [
            {
                price_data: {
                    currency: "AED",
                    product_data: {
                        name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        success_url: `${configs_1.configs.jwt.front_end_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${configs_1.configs.jwt.front_end_url}/payment-failed`,
        metadata: { userId, plan },
    });
    // ✅ Store pending payment
    yield payment_model_1.Payment.create({
        userId,
        plan,
        isSubscription: true,
        amount: amount / 100,
        currency: "AED",
        paymentIntentId: session.id,
        paymentStatus: "pending",
        mode: "subscription",
    });
    if (session) {
        yield user_schema_1.User_Model.findByIdAndUpdate(userId, { isPaidPlan: true }, { new: true });
    }
    return session.url;
});
exports.createSubscriptionSessionService = createSubscriptionSessionService;
const verifySubscriptionPaymentService = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Retrieve the Stripe session
    const session = yield stripe_config_1.stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
        const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId;
        const plan = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.plan;
        // ✅ Update Payment status
        const payment = yield payment_model_1.Payment.findOneAndUpdate({ paymentIntentId: session.id }, { paymentStatus: "succeeded" }, { new: true });
        let updatedUser = null;
        // ✅ Update user's paid plan
        if (userId) {
            updatedUser = yield user_schema_1.User_Model.findByIdAndUpdate(userId, { isPaidPlan: true, paidPlan: plan }, { new: true } // return updated user
            );
        }
        return {
            success: true,
            message: "Subscription payment successful",
            session,
            payment,
            isPaidPlan: (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isPaidPlan) || false, // return updated value
        };
    }
    return { success: false, message: "Payment not completed", session: null };
});
exports.verifySubscriptionPaymentService = verifySubscriptionPaymentService;
