import { ICartItem } from "./cart.interface";
import { Cart } from "./cart.model";


export const createCart = async (userId: string, items: ICartItem[]) => {
  console.log(items, "items from service");

  // Step 1: Check if user already has a cart
  let existingCart = await Cart.findOne({ userId });

  // Step 2: If no cart exists, create a new one
  if (!existingCart) {
    const newCart = new Cart({
      userId,
      items,
    });
    await newCart.save();
    return {
      success: true,
      message: "Cart created successfully.",
      cart: newCart,
    };
  }

  // Step 3: Check for duplicate items (based on productId)
  const existingProductIds = existingCart.items.map((item) =>
    item.productId.toString()
  );

  const duplicateItem = items.find((newItem) =>
    existingProductIds.includes(newItem.productId.toString())
  );

  if (duplicateItem) {
    return {
      success: false,
      message: "Item already exists in cart.",
      productId: duplicateItem.productId,
    };
  }

  // Step 4: Add new items and save
  existingCart.items.push(...items);
  await existingCart.save();

  return {
    success: true,
    message: "Item added to cart successfully.",
    cart: existingCart,
  };
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
