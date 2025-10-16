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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistService = exports.isProductWishlisted = exports.removeWishlistProducts = exports.getUserWishlist = exports.createOrUpdateWishlist = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wishListedProducts_model_1 = require("./wishListedProducts.model");
const createOrUpdateWishlist = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the wishlist already exists
    let wishlist = yield wishListedProducts_model_1.Wishlist.findOne({ userId });
    if (wishlist) {
        // If product is already in wishlist, remove it (toggle)
        const index = wishlist.withlistProducts.indexOf(productId);
        if (index > -1) {
            wishlist.withlistProducts.splice(index, 1);
        }
        else {
            wishlist.withlistProducts.push(productId);
        }
        yield wishlist.save();
    }
    else {
        // Create new wishlist document
        wishlist = yield wishListedProducts_model_1.Wishlist.create({
            userId,
            withlistProducts: [productId],
        });
    }
    return wishlist;
});
exports.createOrUpdateWishlist = createOrUpdateWishlist;
const getUserWishlist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return wishListedProducts_model_1.Wishlist.findOne({ userId }).populate("withlistProducts");
});
exports.getUserWishlist = getUserWishlist;
const removeWishlistProducts = (userId, productIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate inputs
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid or missing userId");
        }
        if (!Array.isArray(productIds) || productIds.length === 0) {
            throw new Error("productIds must be a non-empty array");
        }
        // Find wishlist
        const wishlist = yield wishListedProducts_model_1.Wishlist.findOne({ userId });
        if (!wishlist) {
            throw new Error("Wishlist not found for this user");
        }
        // Filter out removed products
        const beforeCount = wishlist.withlistProducts.length;
        wishlist.withlistProducts = wishlist.withlistProducts.filter((id) => !productIds.includes(id.toString()));
        const afterCount = wishlist.withlistProducts.length;
        // Check if anything was removed
        if (beforeCount === afterCount) {
            throw new Error("No matching products found in wishlist to remove");
        }
        yield wishlist.save();
        return wishlist;
    }
    catch (error) {
        console.error("Error in removeWishlistProducts:", error.message);
        throw new Error(error.message || "Failed to remove wishlist products");
    }
});
exports.removeWishlistProducts = removeWishlistProducts;
const isProductWishlisted = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !productId) {
        throw new Error("User ID and Product ID are required");
    }
    const wishlist = yield wishListedProducts_model_1.Wishlist.findOne({ userId });
    if (!wishlist)
        return false;
    return wishlist.withlistProducts.includes(productId);
});
exports.isProductWishlisted = isProductWishlisted;
exports.wishlistService = {
    createOrUpdateWishlist: exports.createOrUpdateWishlist,
    getUserWishlist: exports.getUserWishlist,
    removeWishlistProducts: exports.removeWishlistProducts,
    isProductWishlisted: exports.isProductWishlisted
};
