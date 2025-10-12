import { Router } from "express";
import { createPromotion, getPromotion, getAllPromotions, updatePromotion, pausePromotion, getSellerPromotions } from "./promotion.controller";
import { promotionUpload } from "./promotion.multer";

const router = Router();

// Create Promotion
router.post("/create", promotionUpload.single("promotionImage"), createPromotion);

// Get all promotion
router.get("/getAll", getAllPromotions);

// Get single promotion
router.get("/:id", getPromotion);

// ✅ Update promotion by ID (optional image upload)
router.put(
  "/update/:id",
  promotionUpload.single("promotionImage"),
  updatePromotion
);

// Pause a promotion by ID
router.patch("/pause/:id", pausePromotion);

// In your routes file
router.get('/marketing-promotions/:userId', getSellerPromotions);

export const PromotionRoute = router;
