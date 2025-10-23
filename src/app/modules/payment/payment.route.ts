import express from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Regullar Payment
router.post("/checkout", auth("Admin","Buyer","Seller") , paymentController.createCheckoutSession);
router.get("/payment-success",paymentController.verifyPayment);

// Subscription Payment
router.post("/subscription/create",auth("Admin","Seller") , paymentController.createSubscriptionSession);
// ✅ Verify subscription payment success
router.get("/subscription/verify", paymentController.verifySubscriptionPayment);
router.post("/checkout/subscription", paymentController.createSubscriptionController);
// Checkout direct payment Buyer to Seller
router.post('/checkout-direct-payment/create', paymentController.createDirectPaymentController );

export const paymentRoutes = router;
