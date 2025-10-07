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
exports.CartService = void 0;
const cart_model_1 = require("./cart.model");
// Create Cart Service
const createCart = (userId, items) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new cart
    const cart = new cart_model_1.Cart({
        userId,
        items,
    });
    // Save the cart and return the saved cart
    return yield cart.save();
});
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
    createCart,
    getSingleCart,
};
