"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const subscriptionCheck_1 = require("../../middlewares/subscriptionCheck");
const router = express_1.default.Router();
// Regullar Payment
router.post("/checkout", (0, auth_1.default)("Admin", "Buyer", "Seller"), payment_controller_1.paymentController.createCheckoutSession);
router.get("/payment-success", payment_controller_1.paymentController.verifyPayment);
// Subscription Payment
router.post("/subscription/create", (0, auth_1.default)("Admin", "Seller"), payment_controller_1.paymentController.createSubscriptionSession);
// ✅ Verify subscription payment success
router.get("/subscription/verify", payment_controller_1.paymentController.verifySubscriptionPayment);
router.post("/checkout/subscription", subscriptionCheck_1.checkUserSubscription, payment_controller_1.paymentController.createSubscriptionController);
// Checkout direct payment Buyer to Seller
router.post("/checkout-direct-payment/create", payment_controller_1.paymentController.createDirectPaymentController);
// Get total subscription amount
router.get("/subscription/total", payment_controller_1.paymentController.getTotalSubscriptionAmountController);
exports.paymentRoutes = router;
