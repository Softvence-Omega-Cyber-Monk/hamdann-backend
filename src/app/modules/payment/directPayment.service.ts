import { Checkout } from "checkout-sdk-node";
import { Payment } from "./payment.model";
import { User_Model } from "../user/user.schema";
import { Order } from "../order/order.model";
import { Product } from "../products/products.model";

// Map Checkout payment statuses to our Payment.paymentStatus enum
const mapCheckoutStatusToPaymentStatus = (status?: string) => {
  if (!status) return "pending";
  const s = String(status).toLowerCase();
  if (
    s.includes("auth") ||
    s.includes("paid") ||
    s.includes("captur") ||
    s.includes("succe") ||
    s.includes("approved") ||
    s.includes("authorised") ||
    s.includes("authorized")
  )
    return "succeeded";
  if (
    s.includes("declin") ||
    s.includes("fail") ||
    s.includes("refus") ||
    s.includes("error") ||
    s.includes("rejected")
  )
    return "failed";
  return "pending";
};

// Minimal seller credential validator used by the direct payment flow
const validateSellerCredentials = (seller: any) => {
  if (!seller) return { isValid: false, error: "Seller not found" };
  if (!seller.checkoutSecretKey || !seller.checkoutProcessingChannelId) {
    return { isValid: false, error: "Missing Checkout credentials" };
  }

  const isSandboxKey =
    typeof seller.checkoutSecretKey === "string" &&
    seller.checkoutSecretKey.startsWith("sk_sbox_");
  const isLiveKey =
    typeof seller.checkoutSecretKey === "string" &&
    seller.checkoutSecretKey.startsWith("sk_live_");
  if (!isSandboxKey && !isLiveKey) {
    return {
      isValid: false,
      error:
        "Invalid secret key format - must start with 'sk_sbox_' or 'sk_live_'",
    };
  }

  return { isValid: true, environment: isSandboxKey ? "sandbox" : "live" };
};

export const createDirectPaymentForMultipleSellers = async (
  orderId: string,
  card: {
    number: string;
    expiry_month: number;
    expiry_year: number;
    cvv: string;
  }
) => {
  const order = await Order.findById(orderId).populate("items.productId");
  if (!order) throw new Error("Order not found");

  // Group items by seller
  const sellerTotals = new Map<string, number>();
  for (const item of order.items) {
    const product: any = item.productId;
    if (!product?.userId) continue;
    const sellerId = product.userId.toString();
    const itemTotal = item.price * item.quantity;
    sellerTotals.set(sellerId, (sellerTotals.get(sellerId) || 0) + itemTotal);
  }

  if (sellerTotals.size === 0) throw new Error("No sellers found");

  const paymentResults: any[] = [];

  // DEBUG: log computed seller totals (helps explain empty payments array)
  try {
    const sellersDebug: any[] = [];
    for (const [sId, amt] of sellerTotals.entries())
      sellersDebug.push({ sellerId: sId, amount: amt });
    console.log(
      "Computed seller totals:",
      JSON.stringify(sellersDebug, null, 2)
    );
  } catch (e) {
    console.warn("Failed to log seller totals", e);
  }
  for (const [sellerId, amount] of sellerTotals.entries()) {
    const seller = await User_Model.findById(sellerId);
    if (!seller) {
      // Instead of silently skipping, record a failed payment so caller sees why no payments were processed
      console.warn(`Seller not found for id ${sellerId}`);
      paymentResults.push({
        sellerId,
        sellerEmail: null,
        amount,
        success: false,
        error: "Seller not found in users collection",
      });
      continue;
    }

    const credentialCheck = validateSellerCredentials(seller);
    if (!credentialCheck.isValid) {
      console.warn(
        `Missing checkout credentials for seller ${seller?.email || sellerId}`
      );
      paymentResults.push({
        sellerEmail: seller?.email || sellerId,
        amount,
        success: false,
        error: credentialCheck.error,
      });
      continue;
    }

    try {
      console.log("=== PAYMENT DEBUG START ===");
      console.log("Seller:", seller.email);

      const derivedEnvironment = credentialCheck.environment;
      console.log("Derived environment from key:", derivedEnvironment);

      const checkout = new Checkout(seller.checkoutSecretKey, {
        environment: derivedEnvironment,
        headers: {
          "Cko-Processing-Channel": seller.checkoutProcessingChannelId,
        },
      } as any);

      // SKIP TOKENIZATION - Use direct card payment
      console.log("🔹 Using direct card payment (bypassing tokenization)...");

      const amountInCents = Math.round(amount * 100);
      console.log("Amount:", amount, "->", amountInCents, "cents");

      // Build payload
      const paymentPayload: any = {
        source: {
          type: "card",
          number: card.number.replace(/\s/g, ""),
          expiry_month: card.expiry_month,
          expiry_year: card.expiry_year,
          cvv: card.cvv,
          name: "Customer",
          billing_address: {
            address_line1: "Not Provided",
            city: "Dubai",
            country: "AE",
          },
        },
        amount: amountInCents,
        currency: order.currency?.toUpperCase() || "AED",
        capture: true,
        reference: `order_${orderId}_${sellerId}_${Date.now()}`,
        metadata: { orderId, sellerId, sellerEmail: seller.email },
        processing_channel_id: seller.checkoutProcessingChannelId,
        "3ds": { enabled: false },
      };

      // Log payload masked by default
      try {
        const unmask = process.env.CHECKOUT_DEBUG_UNMASK === "true";
        const payloadForLog: any = JSON.parse(JSON.stringify(paymentPayload));
        if (!unmask) {
          if (payloadForLog.source?.number)
            payloadForLog.source.number = payloadForLog.source.number.replace(
              /.(?=.{4})/g,
              "*"
            );
          if (payloadForLog.processing_channel_id)
            payloadForLog.processing_channel_id = `${payloadForLog.processing_channel_id.slice(
              0,
              6
            )}...`;
        }
        console.log(
          "Outgoing payment payload:",
          JSON.stringify(payloadForLog, null, 2)
        );
      } catch (logErr) {
        console.warn("Failed to log payment payload", logErr);
      }

      const paymentRes: any = await checkout.payments.request(paymentPayload);

      console.log("✅ Payment Response Received");
      console.log("Payment ID:", paymentRes.id);
      console.log("Payment Status:", paymentRes.status);
      console.log("Approved:", paymentRes.approved);

      // Map status and save
      const mappedStatus = mapCheckoutStatusToPaymentStatus(paymentRes.status);

      const res = await Payment.create({
        userId: order.userId,
        sellerId,
        amount,
        currency: order.currency?.toUpperCase() || "AED",
        paymentIntentId: paymentRes.id,
        paymentStatus: mappedStatus,
        paymentDate: new Date(),
        mode: "payment",
      });

      paymentResults.push({
        sellerEmail: seller.email,
        amount,
        success: true,
        paymentId: paymentRes.id,
        status: paymentRes.status,
        mappedStatus,
        approved: paymentRes.approved,
      });

      if (res) {
        for (const item of order.items) {
          const product: any = item.productId;

          const updatedProduct = await Product.findOneAndUpdate(
            { _id: product._id }, // or { _id: productId }
            { $inc: { salesCount: 1 } },
            { new: true } // returns the updated document
          );

          console.log("pproduct", updatedProduct);
          // ✅ Update order status and save
          order.status = "payment_processed";
          await order.save();
        }
      }

      console.log("=== PAYMENT DEBUG END ===");
    } catch (err: any) {
      console.error("❌ PAYMENT ERROR DETAILS:");
      console.error("Error Message:", err?.message || err);
      console.error("Error HTTP Code:", err?.http_code);
      if (err?.body)
        console.error("Error Body:", JSON.stringify(err.body, null, 2));

      paymentResults.push({
        sellerEmail: seller.email,
        amount,
        success: false,
        error: err?.message || String(err),
        httpCode: err?.http_code,
      });
    }
  }

  return {
    success: paymentResults.some((p) => p.success),
    message: "Payments processed",
    data: { orderId, payments: paymentResults },
  };
};
