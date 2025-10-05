import { Request, Response } from "express";
import { CartService } from "./cart.service";

// Create Cart Controller
const createCart = async (req: Request, res: Response) => {
  try {
    const { userId, items } = req.body;

    // Check if userId and items are provided
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Call service to create a cart
    const cart = await CartService.createCart(userId, items);

    // Return created cart as response
    return res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create cart" });
  }
};

export const CartController = {
  createCart,
};
