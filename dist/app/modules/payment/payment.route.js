"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Regullar Payment
router.post("/checkout", (0, auth_1.default)("Admin", "Buyer", "Seller"), payment_controller_1.paymentController.createCheckoutSession);
router.get("/payment-success", payment_controller_1.paymentController.verifyPayment);
// Subscription Payment
router.post("/subscription/create", (0, auth_1.default)("Admin", "Seller"), payment_controller_1.paymentController.createSubscriptionSession);
// ✅ Verify subscription payment success
router.get("/subscription/verify", payment_controller_1.paymentController.verifySubscriptionPayment);
exports.paymentRoutes = router;
