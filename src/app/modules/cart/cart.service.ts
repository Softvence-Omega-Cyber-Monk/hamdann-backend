import { Cart } from "./cart.model";
import { ICartItem } from "./cart.interface";

// Create Cart Service
const createCart = async (userId: string, items: ICartItem[]) => {
  // Create a new cart
  const cart = new Cart({
    userId,
    items,
  });

  // Save the cart and return the saved cart
  return await cart.save();
};

const getSingleCart = async (userId: string) => {
  try {
    console.log("user id form service", userId);
    // Find cart by userId and populate related data like user and items
    const cart = await Cart.find({ userId })
      .populate("userId", "name email")
      .populate("items.productId", "name price quantity image");

    return cart;
  } catch (error: any) {
    throw new Error(`Failed to fetch cart data: ${error.message}`);
  }
};

export const CartService = {
  createCart,
  getSingleCart,
};
