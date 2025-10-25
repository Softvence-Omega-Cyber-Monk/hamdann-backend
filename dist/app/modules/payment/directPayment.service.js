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
exports.createDirectPaymentForMultipleSellers = void 0;
const checkout_sdk_node_1 = require("checkout-sdk-node");
const payment_model_1 = require("./payment.model");
const user_schema_1 = require("../user/user.schema");
const order_model_1 = require("../order/order.model");
// Map Checkout payment statuses to our Payment.paymentStatus enum
const mapCheckoutStatusToPaymentStatus = (status) => {
    if (!status)
        return "pending";
    const s = String(status).toLowerCase();
    if (s.includes("auth") || s.includes("paid") || s.includes("captur") || s.includes("succe") || s.includes("approved") || s.includes("authorised") || s.includes("authorized"))
        return "succeeded";
    if (s.includes("declin") || s.includes("fail") || s.includes("refus") || s.includes("error") || s.includes("rejected"))
        return "failed";
    return "pending";
};
// Minimal seller credential validator used by the direct payment flow
const validateSellerCredentials = (seller) => {
    if (!seller)
        return { isValid: false, error: "Seller not found" };
    if (!seller.checkoutSecretKey || !seller.checkoutProcessingChannelId) {
        return { isValid: false, error: "Missing Checkout credentials" };
    }
    const isSandboxKey = typeof seller.checkoutSecretKey === "string" && seller.checkoutSecretKey.startsWith("sk_sbox_");
    const isLiveKey = typeof seller.checkoutSecretKey === "string" && seller.checkoutSecretKey.startsWith("sk_live_");
    if (!isSandboxKey && !isLiveKey) {
        return { isValid: false, error: "Invalid secret key format - must start with 'sk_sbox_' or 'sk_live_'" };
    }
    return { isValid: true, environment: isSandboxKey ? "sandbox" : "live" };
};
const createDirectPaymentForMultipleSellers = (orderId, card) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const order = yield order_model_1.Order.findById(orderId).populate("items.productId");
    if (!order)
        throw new Error("Order not found");
    // Group items by seller
    const sellerTotals = new Map();
    for (const item of order.items) {
        const product = item.productId;
        if (!(product === null || product === void 0 ? void 0 : product.userId))
            continue;
        const sellerId = product.userId.toString();
        const itemTotal = item.price * item.quantity;
        sellerTotals.set(sellerId, (sellerTotals.get(sellerId) || 0) + itemTotal);
    }
    if (sellerTotals.size === 0)
        throw new Error("No sellers found");
    const paymentResults = [];
    for (const [sellerId, amount] of sellerTotals.entries()) {
        const seller = yield user_schema_1.User_Model.findById(sellerId);
        if (!seller)
            continue;
        const credentialCheck = validateSellerCredentials(seller);
        if (!credentialCheck.isValid) {
            console.warn(`Missing checkout credentials for seller ${(seller === null || seller === void 0 ? void 0 : seller.email) || sellerId}`);
            paymentResults.push({ sellerEmail: (seller === null || seller === void 0 ? void 0 : seller.email) || sellerId, amount, success: false, error: credentialCheck.error });
            continue;
        }
        try {
            console.log("=== PAYMENT DEBUG START ===");
            console.log("Seller:", seller.email);
            const derivedEnvironment = credentialCheck.environment;
            console.log("Derived environment from key:", derivedEnvironment);
            const checkout = new checkout_sdk_node_1.Checkout(seller.checkoutSecretKey, {
                environment: derivedEnvironment,
                headers: { "Cko-Processing-Channel": seller.checkoutProcessingChannelId },
            });
            // SKIP TOKENIZATION - Use direct card payment
            console.log("🔹 Using direct card payment (bypassing tokenization)...");
            const amountInCents = Math.round(amount * 100);
            console.log("Amount:", amount, "->", amountInCents, "cents");
            // Build payload
            const paymentPayload = {
                source: {
                    type: "card",
                    number: card.number.replace(/\s/g, ""),
                    expiry_month: card.expiry_month,
                    expiry_year: card.expiry_year,
                    cvv: card.cvv,
                    name: "Customer",
                    billing_address: { address_line1: "Not Provided", city: "Dubai", country: "AE" },
                },
                amount: amountInCents,
                currency: ((_a = order.currency) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || "AED",
                capture: true,
                reference: `order_${orderId}_${sellerId}_${Date.now()}`,
                metadata: { orderId, sellerId, sellerEmail: seller.email },
                processing_channel_id: seller.checkoutProcessingChannelId,
                "3ds": { enabled: false },
            };
            // Log payload masked by default
            try {
                const unmask = process.env.CHECKOUT_DEBUG_UNMASK === "true";
                const payloadForLog = JSON.parse(JSON.stringify(paymentPayload));
                if (!unmask) {
                    if ((_b = payloadForLog.source) === null || _b === void 0 ? void 0 : _b.number)
                        payloadForLog.source.number = payloadForLog.source.number.replace(/.(?=.{4})/g, "*");
                    if (payloadForLog.processing_channel_id)
                        payloadForLog.processing_channel_id = `${payloadForLog.processing_channel_id.slice(0, 6)}...`;
                }
                console.log("Outgoing payment payload:", JSON.stringify(payloadForLog, null, 2));
            }
            catch (logErr) {
                console.warn("Failed to log payment payload", logErr);
            }
            const paymentRes = yield checkout.payments.request(paymentPayload);
            console.log("✅ Payment Response Received");
            console.log("Payment ID:", paymentRes.id);
            console.log("Payment Status:", paymentRes.status);
            console.log("Approved:", paymentRes.approved);
            // Map status and save
            const mappedStatus = mapCheckoutStatusToPaymentStatus(paymentRes.status);
            yield payment_model_1.Payment.create({
                userId: order.userId,
                sellerId,
                amount,
                currency: ((_c = order.currency) === null || _c === void 0 ? void 0 : _c.toUpperCase()) || "AED",
                paymentIntentId: paymentRes.id,
                paymentStatus: mappedStatus,
                paymentDate: new Date(),
                mode: "payment",
            });
            paymentResults.push({ sellerEmail: seller.email, amount, success: true, paymentId: paymentRes.id, status: paymentRes.status, mappedStatus, approved: paymentRes.approved });
            console.log("=== PAYMENT DEBUG END ===");
        }
        catch (err) {
            console.error("❌ PAYMENT ERROR DETAILS:");
            console.error("Error Message:", (err === null || err === void 0 ? void 0 : err.message) || err);
            console.error("Error HTTP Code:", err === null || err === void 0 ? void 0 : err.http_code);
            if (err === null || err === void 0 ? void 0 : err.body)
                console.error("Error Body:", JSON.stringify(err.body, null, 2));
            paymentResults.push({ sellerEmail: seller.email, amount, success: false, error: (err === null || err === void 0 ? void 0 : err.message) || String(err), httpCode: err === null || err === void 0 ? void 0 : err.http_code });
        }
    }
    return { success: paymentResults.some((p) => p.success), message: "Payments processed", data: { orderId, payments: paymentResults } };
});
exports.createDirectPaymentForMultipleSellers = createDirectPaymentForMultipleSellers;
