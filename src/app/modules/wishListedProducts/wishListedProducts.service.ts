import { isWishlistedProducts } from "./wishListedProducts.interface";
import { Wishlist } from "./wishListedProducts.model";


export const createOrUpdateWishlist = async (
  userId: string,
  productId: string
): Promise<isWishlistedProducts> => {
  // Check if the wishlist already exists
  let wishlist = await Wishlist.findOne({ userId });

  if (wishlist) {
    // If product is already in wishlist, remove it (toggle)
    const index = wishlist.withlistProducts.indexOf(productId);
    if (index > -1) {
      wishlist.withlistProducts.splice(index, 1);
    } else {
      wishlist.withlistProducts.push(productId);
    }
    await wishlist.save();
  } else {
    // Create new wishlist document
    wishlist = await Wishlist.create({
      userId,
      withlistProducts: [productId],
    });
  }

  return wishlist;
};

export const getUserWishlist = async (
  userId: string
): Promise<isWishlistedProducts | null> => {
  return Wishlist.findOne({ userId }).populate("withlistProducts");
};


export const wishlistService = {
  createOrUpdateWishlist,
  getUserWishlist,
};
