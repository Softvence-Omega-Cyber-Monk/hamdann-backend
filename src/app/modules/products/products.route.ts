import express from "express";
import { productController } from "./products.controller";
import { upload, uploadMultiple, uploadSingle } from "../../utils/cloudinary";

const router = express.Router();

router.post("/create", upload.any(), productController.createProduct); // ✅ Create product
router.put("/update/:id", productController.updateProduct); // ✅ Update product
// ✅ Get all products
router.get("/getSingle/:id", productController.getSingleProduct); // ✅ Get single product
router.get("/getAll", productController.getAllProducts);
router.get(
  "/getSingleCategory/:category",
  productController.getProductByCategoryService
);
router.get("/getNewArrivals", productController.getNewArrivalsProductsService);
router.get("/getBestSelling", productController.getBestSellingProductsService);
router.put(
  "/update/wishList/:productId",
  productController.getWishlistedProductsService
);
router.put("/remove/wishList", productController.removeProductsWishlist);
// New route for product statistics
router.get("/stats", productController.getProductStats);

export const productRoutes = router;
