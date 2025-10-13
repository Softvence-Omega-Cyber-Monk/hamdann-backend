import { stripe } from "../../configs/stripe.config";
import { configs } from "../../configs";
import { Payment } from "./payment.model";
import { User_Model } from "../user/user.schema";
import { Order } from "../order/order.model";

export const createCheckoutSessionService = async (orderId: string) => {
  const orderAmount = await Order.findById(orderId);


  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "aed",
          product_data: { name: `Order #${orderId}` },
          unit_amount: (orderAmount?.totalAmount as number) * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${configs.jwt.front_end_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${configs.jwt.front_end_url}/payment-failed`,
    metadata: { orderId },
  });

  // store pending payment
  await Payment.create({
    orderId,
    amount: orderAmount?.totalAmount as number,
    currency: "aed",
    paymentIntentId: session.id,
    paymentStatus: "pending",

    mode: "payment",
  });

  return session.url;
};

// Subscription service
export const createSubscriptionSessionService = async (
  userId: string,
  plan: "basic" | "professional" | "premium"
) => {
  // 💰 Plan pricing
  const planPrices: Record<string, number> = {
    basic: 1999,
    professional: 4999,
    premium: 9999,
  };

  const amount = planPrices[plan];

  // ✅ Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
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
    success_url: `${configs.jwt.front_end_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${configs.jwt.front_end_url}/payment-failed`,
    metadata: { userId, plan },
  });

  // ✅ Store pending payment
  await Payment.create({
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
    await User_Model.findByIdAndUpdate(
      userId,
      { isPaidPlan: true },
      { new: true }
    );
  }

  return session.url;
};

export const verifySubscriptionPaymentService = async (sessionId: string) => {
  // Retrieve the Stripe session
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    // ✅ Update Payment status
    const payment = await Payment.findOneAndUpdate(
      { paymentIntentId: session.id },
      { paymentStatus: "succeeded" },
      { new: true }
    );

    let updatedUser = null;

    // ✅ Update user's paid plan
    if (userId) {
      updatedUser = await User_Model.findByIdAndUpdate(
        userId,
        { isPaidPlan: true, paidPlan: plan },
        { new: true } // return updated user
      );
    }

    return {
      success: true,
      message: "Subscription payment successful",
      session,
      payment,
      isPaidPlan: updatedUser?.isPaidPlan || false, // return updated value
    };
  }

  return { success: false, message: "Payment not completed", session: null };
};
