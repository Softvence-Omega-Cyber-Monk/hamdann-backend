import express from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { checkUserSubscription } from "../../middlewares/subscriptionCheck";

const router = express.Router();

// Regullar Payment
router.post(
  "/checkout",
  auth("Admin", "Buyer", "Seller"),
  paymentController.createCheckoutSession
);
router.get("/payment-success", paymentController.verifyPayment);

// Subscription Payment
router.post(
  "/subscription/create",
  auth("Admin", "Seller"),
  paymentController.createSubscriptionSession
);
// ✅ Verify subscription payment success
router.get("/subscription/verify", paymentController.verifySubscriptionPayment);
router.post(
  "/checkout/subscription",
  checkUserSubscription,
  paymentController.createSubscriptionController
);
// Checkout direct payment Buyer to Seller
router.post(
  "/checkout-direct-payment/create",
  paymentController.createDirectPaymentController
);
// Get total subscription amount
router.get(
  "/subscription/total",
  paymentController.getTotalSubscriptionAmountController
);

export const paymentRoutes = router;
