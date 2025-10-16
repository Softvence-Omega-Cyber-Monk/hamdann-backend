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
exports.checkProductWishlistStatus = exports.removeWishlistItems = exports.getUserWishlist = exports.createOrUpdateWishlist = void 0;
const wishListedProducts_service_1 = require("./wishListedProducts.service");
const createOrUpdateWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ message: "userId and productId are required." });
        }
        const wishlist = yield wishListedProducts_service_1.wishlistService.createOrUpdateWishlist(userId, productId);
        res.status(200).json({
            success: true,
            message: "Wishlist updated successfully.",
            data: wishlist,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update wishlist.",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.createOrUpdateWishlist = createOrUpdateWishlist;
const getUserWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const wishlist = yield wishListedProducts_service_1.wishlistService.getUserWishlist(userId);
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found for this user." });
        }
        res.status(200).json({
            success: true,
            data: wishlist,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist.",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.getUserWishlist = getUserWishlist;
const removeWishlistItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productIds } = req.body;
        if (!Array.isArray(productIds)) {
            return res.status(400).json({
                success: false,
                message: "productIds must be an array",
            });
        }
        const wishlist = yield wishListedProducts_service_1.wishlistService.removeWishlistProducts(userId, productIds);
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found for this user",
            });
        }
        res.status(200).json({
            success: true,
            message: "Selected products removed from wishlist",
            data: wishlist,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.removeWishlistItems = removeWishlistItems;
const checkProductWishlistStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ success: false, message: "User ID and Product ID are required" });
        }
        const isWishlisted = yield wishListedProducts_service_1.wishlistService.isProductWishlisted(userId, productId);
        res.status(200).json({
            success: true,
            data: { isWishlisted },
        });
    }
    catch (error) {
        console.error("Error checking wishlist:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to check wishlist status",
            error: error.message,
        });
    }
});
exports.checkProductWishlistStatus = checkProductWishlistStatus;
