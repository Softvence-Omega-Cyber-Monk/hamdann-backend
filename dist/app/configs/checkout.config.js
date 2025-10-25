"use strict";
// import { Checkout } from "checkout-sdk-node";
// import dotenv from "dotenv";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
// dotenv.config();
// if (!process.env.CHECKOUT_SECRET_KEY) {
//   throw new Error("CHECKOUT_SECRET_KEY is not defined in .env");
// }
// export const checkout = new Checkout(process.env.CHECKOUT_SECRET_KEY!);
// config/paymentGateway.ts
// config/paymentGateway.ts
const checkout_sdk_node_1 = require("checkout-sdk-node");
const checkoutConfig = {
    pk: process.env.CHECKOUT_PUBLIC_KEY,
    environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
};
// Add processing channel as header
if (process.env.CHECKOUT_PROCESSING_CHANNEL_ID) {
    checkoutConfig.headers = {
        'Cko-Processing-Channel': process.env.CHECKOUT_PROCESSING_CHANNEL_ID
    };
}
exports.checkout = new checkout_sdk_node_1.Checkout(process.env.CHECKOUT_SECRET_KEY, checkoutConfig);
