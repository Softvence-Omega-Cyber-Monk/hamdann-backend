"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionRoute = void 0;
const express_1 = require("express");
const promotion_controller_1 = require("./promotion.controller");
const promotion_multer_1 = require("./promotion.multer");
const router = (0, express_1.Router)();
// Create Promotion
router.post("/create", promotion_multer_1.promotionUpload.single("promotionImage"), promotion_controller_1.createPromotion);
// Get all promotion
router.get("/getAll", promotion_controller_1.getAllPromotions);
// Get single promotion
router.get("/:id", promotion_controller_1.getPromotion);
// ✅ Update promotion by ID (optional image upload)
router.put("/update/:id", promotion_multer_1.promotionUpload.single("promotionImage"), promotion_controller_1.updatePromotion);
// Pause a promotion by ID
router.patch("/pause/:id", promotion_controller_1.pausePromotion);
// In your routes file
router.get('/marketing-promotions/:userId', promotion_controller_1.getSellerPromotions);
exports.PromotionRoute = router;
