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
exports.CartController = void 0;
const cart_service_1 = require("./cart.service");
// Create Cart Controller
const createCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, items } = req.body;
        // Call service to create a cart
        const cart = yield cart_service_1.CartService.createCart(userId, items);
        // Return created cart as response
        return res.status(201).json(cart);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create cart" });
    }
});
const getSingleCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params; // Extract userId from route parameters
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // Call service to get the cart by userId
        const cart = yield cart_service_1.CartService.getSingleCart(userId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        // Return the cart data as response
        return res.status(200).json(cart);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch cart data" });
    }
});
exports.CartController = {
    createCart,
    getSingleCart,
};
