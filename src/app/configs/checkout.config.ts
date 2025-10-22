import { Checkout } from "checkout-sdk-node";

// ✅ Use sandbox secret key directly
export const checkout = new Checkout(process.env.CHECKOUT_SECRET_KEY);
