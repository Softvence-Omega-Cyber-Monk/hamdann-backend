import { Cart } from "./cart.model";
import { ICartItem } from "./cart.interface";

// Utility function to calculate the subtotal
// Utility function to calculate subtotal, shipping cost, and total amount
const calculateOrderAmounts = (items: ICartItem[]) => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate shipping cost as 10% of the subtotal
  const shippingCost = subtotal * 0.1; // 10% of subtotal

  // Calculate tax as 5% of the subtotal
  const tax = subtotal * 0.05; // 5% of subtotal

  // Calculate the total amount (subtotal + shipping cost + tax)
  const totalAmount = subtotal + shippingCost + tax;

  return { subtotal, shippingCost, tax, totalAmount };
};
// Create Cart Service
const createCart = async (userId: string, items: ICartItem[]) => {
  // Calculate subtotal
  const {subTotal,shippingCost,tax,totalAmount} = calculateOrderAmounts(items);

  // Create a new cart
  const cart = new Cart({
    userId,
    items,
    subTotal,
  });

  // Save the cart and return the saved cart
  return await cart.save();
};

export const CartService = {
  createCart,
};
