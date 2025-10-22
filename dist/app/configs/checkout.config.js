"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
const checkout_sdk_node_1 = require("checkout-sdk-node");
// ✅ Use sandbox secret key directly
exports.checkout = new checkout_sdk_node_1.Checkout(process.env.CHECKOUT_SECRET_KEY);
