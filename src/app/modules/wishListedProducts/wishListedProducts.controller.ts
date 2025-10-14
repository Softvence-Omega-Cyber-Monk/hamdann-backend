// controllers/wishlist.controller.ts
import { Request, Response } from "express";
import { wishlistService } from "./wishListedProducts.service";


export const createOrUpdateWishlist = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required." });
    }

    const wishlist = await wishlistService.createOrUpdateWishlist(userId, productId);
    res.status(200).json({
      success: true,
      message: "Wishlist updated successfully.",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update wishlist.",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getUserWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const wishlist = await wishlistService.getUserWishlist(userId);

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found for this user." });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist.",
      error: error instanceof Error ? error.message : error,
    });
  }
};
