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
exports.CartService = exports.createCart = void 0;
const cart_model_1 = require("./cart.model");
const createCart = (userId, items) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(items, "items from service");
    // Step 1: Check if user already has a cart
    let existingCart = yield cart_model_1.Cart.findOne({ userId });
    // Step 2: If no cart exists, create a new one
    if (!existingCart) {
        const newCart = new cart_model_1.Cart({
            userId,
            items,
        });
        yield newCart.save();
        return {
            success: true,
            message: "Cart created successfully.",
            cart: newCart,
        };
    }
    // Step 3: Check for duplicate items (based on productId)
    const existingProductIds = existingCart.items.map((item) => item.productId.toString());
    const duplicateItem = items.find((newItem) => existingProductIds.includes(newItem.productId.toString()));
    if (duplicateItem) {
        return {
            success: false,
            message: "This item already exists in cart.",
            productId: duplicateItem.productId,
        };
    }
    // Step 4: Add new items and save
    existingCart.items.push(...items);
    yield existingCart.save();
    return {
        success: true,
        message: "Item added to cart successfully.",
        cart: existingCart,
    };
});
exports.createCart = createCart;
const getSingleCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("user id form service", userId);
        // Find cart by userId and populate related data like user and items
        const cart = yield cart_model_1.Cart.find({ userId })
            .populate("userId", "name email")
            .populate("items.productId", "name price quantity image");
        return cart;
    }
    catch (error) {
        throw new Error(`Failed to fetch cart data: ${error.message}`);
    }
});
exports.CartService = {
    createCart: exports.createCart,
    getSingleCart,
};
