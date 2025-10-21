import { stripe } from "../../configs/stripe.config";
import { configs } from "../../configs";
import { Payment } from "./payment.model";
import { User_Model } from "../user/user.schema";
import { Order } from "../order/order.model";
import { Product } from "../products/products.model";
import { AppError } from "../../utils/app_error";

// export const createCheckoutSessionService = async (orderId: string) => {
//   const orderAmount: any = await Order.findById(orderId);

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     line_items: [
//       {
//         price_data: {
//           currency: "aed",
//           product_data: { name: `Order #${orderId}` },
//           unit_amount: Math.round(orderAmount?.totalAmount * 100),
//         },
//         quantity: 1,
//       },
//     ],
//     success_url: `${configs.jwt.front_end_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${configs.jwt.front_end_url}/payment-failed`,
//     metadata: { orderId },
//   });
//   //  console.log("session", session);

//   // store pending payment
//   await Payment.create({
//     orderId,
//     amount: orderAmount?.totalAmount as number,
//     currency: "aed",
//     paymentIntentId: session.id,
//     paymentStatus: "pending",

//     mode: "payment",
//   });

//   return session.url;
// };

// export const createCheckoutSessionService = async (orderId: string) => {
//   // 1️⃣ Get order with products
//   const order = await Order.findById(orderId).populate("items.productId");
//   if (!order) throw new Error("Order not found");

//   // 2️⃣ Group items by seller
//   const sellerTotals = new Map<string, number>();
//   for (const item of order.items) {
//     const product: any = item.productId;
//     if (!product?.userId) continue;
//     const sellerId = product.userId.toString();
//     const itemTotal = item.price * item.quantity;
//     sellerTotals.set(sellerId, (sellerTotals.get(sellerId) || 0) + itemTotal);
//   }

//   if (sellerTotals.size === 0) throw new Error("No sellers found");

//   // 3️⃣ Ensure Stripe Custom account for each seller
//   const sellerAccounts: {
//     sellerId: string;
//     stripeAccountId: string;
//     amount: number;
//   }[] = [];
//   for (const [sellerId, amount] of sellerTotals.entries()) {
//     const seller = await User_Model.findById(sellerId);
//     if (!seller) continue;

//     let stripeAccountId = (seller as any).stripeAccountId;
//     if (!stripeAccountId) {
//       const account = await stripe.accounts.create({
//         type: "custom",
//         country: "AE",
//         email: seller.email,
//         business_type: "individual",
//         capabilities: {
//           card_payments: { requested: true },
//           transfers: { requested: true },
//         },
//       });
//       stripeAccountId = account.id;
//       (seller as any).stripeAccount = stripeAccountId;
//       await seller.save();
//     }

//     sellerAccounts.push({ sellerId, stripeAccountId, amount });
//   }

//   // 4️⃣ Total order amount
//   const totalAmount = sellerAccounts.reduce((sum, s) => sum + s.amount, 0);

//   // 5️⃣ Create Stripe Checkout session
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     line_items: [
//       {
//         price_data: {
//           currency: order.currency?.toLowerCase() || "aed",
//           product_data: { name: `Order #${order.orderNumber}` },
//           unit_amount: Math.round(totalAmount * 100),
//         },
//         quantity: 1,
//       },
//     ],
//     success_url: `${configs.jwt.front_end_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${configs.jwt.front_end_url}/payment-failed`,
//     metadata: {
//       orderId,
//       sellers: JSON.stringify(
//         sellerAccounts.map((s) => ({
//           sellerId: s.sellerId,
//           stripeAccountId: s.stripeAccountId,
//           amount: s.amount,
//         }))
//       ),
//     },
//   });

//   return session.url;
// };

export const createCheckoutSessionService = async (orderId: string) => {
  // 1️⃣ Get order with products
  const order = await Order.findById(orderId).populate("items.productId");
  if (!order) throw new Error("Order not found");

  // 2️⃣ Group items by seller
  const sellerTotals = new Map<string, number>();
  for (const item of order.items) {
    const product: any = item.productId;
    if (!product?.userId) continue;
    const sellerId = product.userId.toString();
    const itemTotal = item.price * item.quantity;
    sellerTotals.set(sellerId, (sellerTotals.get(sellerId) || 0) + itemTotal);
  }

  if (sellerTotals.size === 0) throw new Error("No sellers found");

  // 3️⃣ Ensure Stripe account for each seller (AE platform)
  const sellerAccounts: {
    sellerId: string;
    stripeAccountId: string;
    amount: number;
  }[] = [];

  for (const [sellerId, amount] of sellerTotals.entries()) {
    const seller = await User_Model.findById(sellerId);
    if (!seller) continue;
    let account;

    let stripeAccountId = (seller as any).stripeAccountId;
    if (!stripeAccountId) {
      account = await stripe.accounts.create({
        type: "standard",
        country: "AE", // same as platform
        email: seller.email,
        business_type: "company",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;
      (seller as any).stripeAccountId = stripeAccountId;
      await seller.save();
    }
    console.log("Accounts:", account);

    sellerAccounts.push({ sellerId, stripeAccountId, amount });
  }
  console.log("Seller Accounts:", sellerAccounts);
  

  // 4️⃣ Total amount
  const totalAmount = sellerAccounts.reduce((sum, s) => sum + s.amount, 0);

  // 5️⃣ Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: order.currency?.toLowerCase() || "aed",
          product_data: { name: `Order #${order.orderNumber}` },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${configs.jwt.front_end_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${configs.jwt.front_end_url}/payment-failed`,
    metadata: {
      orderId,
      sellers: JSON.stringify(
        sellerAccounts.map((s) => ({
          sellerId: s.sellerId,
          stripeAccountId: s.stripeAccountId,
          amount: s.amount,
        }))
      ),
    },
  });

  return session.url;
};


export const createSubscriptionSessionService = async (
  userId: string,
  plan: "starter" | "advance" | "starterYearly" | "advanceYearly"
) => {
  // 💰 Plan pricing with Stripe Price IDs (you need to create these in Stripe dashboard)
  const planConfigs: Record<string, { priceId: string; amount: number }> = {
    starter: {
      priceId: "price_1SHcorBw3ruVcJRhndtRuEMG", // Replace with actual Stripe Price ID
      amount: 6900,
    },
    advance: {
      priceId: "price_1SHggeBw3ruVcJRhpKNDEzeU", // Replace with actual Stripe Price ID
      amount: 19900,
    },
    starterYearly: {
      priceId: "price_1SJXaqBw3ruVcJRhWtpMFtMY", // Replace with actual Stripe Price ID
      amount: 69900,
    },
    advanceYearly: {
      priceId: "price_1SJXbQBw3ruVcJRhLysvfEPM", // Replace with actual Stripe Price ID
      amount: 199900,
    },
  };

  const planConfig = planConfigs[plan];
  if (!planConfig) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  // Determine product slots based on plan
  let productAddedPowerQuantity: number | "unlimited";
  if (plan === "starter") {
    productAddedPowerQuantity = 20;
  } else if (plan === "starterYearly") {
    productAddedPowerQuantity = 240;
  } else {
    productAddedPowerQuantity = "unlimited";
  }

  let updatedUser = null;

  // ✅ Update user's paid plan
  if (userId) {
    updatedUser = await User_Model.findByIdAndUpdate(
      userId,
      {
        isPaidPlan: true,
        paidPlan: plan,
        subscribtionPlan: plan,
        productAddedPowerQuantity: productAddedPowerQuantity,
      },
      { new: true } // return updated user
    );
  }

  // ✅ Create Stripe Checkout Session for SUBSCRIPTION
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription", // Changed from "payment" to "subscription"
    line_items: [
      {
        price: planConfig.priceId, // Use Stripe Price ID instead of price_data
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        userId,
        plan,
        productAddedPowerQuantity: productAddedPowerQuantity.toString(),
      },
    },
    success_url: `${configs.jwt.front_end_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${configs.jwt.front_end_url}/payment-failed`,
    customer_email: updatedUser?.email, // Optional: prefill customer email
    client_reference_id: userId,
    metadata: {
      userId,
      plan,
      productAddedPowerQuantity: productAddedPowerQuantity.toString(),
    },
  });

  // ✅ Store pending subscription (NOT update user yet - wait for webhook confirmation)
  await Payment.create({
    userId,
    plan,
    isSubscription: true,
    amount: planConfig.amount / 100,
    currency: "AED",
    paymentIntentId: session.id,
    subscriptionId: session.subscription?.toString(), // Store subscription ID
    paymentStatus: "pending",
    mode: "subscription",
  });

  // ✅ Return session URL for frontend redirect
  return {
    sessionUrl: session.url,
    sessionId: session.id,
  };
};

export const verifySubscriptionPaymentService = async (sessionId: string) => {
  // Retrieve the Stripe session
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    let productAddedPowerQuantity;
    if (plan === "starter") {
      productAddedPowerQuantity = 20;
    } else {
      productAddedPowerQuantity = "unlimited";
    }
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
        {
          isPaidPlan: true,
          paidPlan: plan,
          subscribtionPlan: plan,
          productAddedPowerQuantity: productAddedPowerQuantity,
        },
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
