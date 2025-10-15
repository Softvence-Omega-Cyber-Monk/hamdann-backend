"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withlistProductsRoutes = void 0;
const express_1 = require("express");
const wishListedProducts_controller_1 = require("./wishListedProducts.controller");
const router = (0, express_1.Router)();
// Create Promotion
router.post("/add", wishListedProducts_controller_1.createOrUpdateWishlist);
// Get all promotion
router.get("/get-single-user/:userId", wishListedProducts_controller_1.getUserWishlist);
router.get("/check/isWishlist", wishListedProducts_controller_1.checkProductWishlistStatus);
router.delete("/remove", wishListedProducts_controller_1.removeWishlistItems);
exports.withlistProductsRoutes = router;
