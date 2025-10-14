import express from "express";
import { productController } from "./products.controller";
import { upload, uploadMultiple, uploadSingle } from "../../utils/cloudinary";

const router = express.Router();

router.post("/create", upload.any(), productController.createProduct); // ✅ Create product
// router.put("/update/:id", productController.updateProduct); // ✅ Update product
router.put(
  "/update/:id",
  upload.fields([
    { name: 'productImages', maxCount: 10 },
    { name: 'mainImage', maxCount: 1 }
  ]),
  productController.updateProduct
);


// ✅ Get all products
router.get("/getSingle/:id", productController.getSingleProduct); // ✅ Get single product
router.get("/getUserProduct/:userId", productController.getSingleUserProductService); // ✅ Get single product
router.get("/getAll", productController.getAllProducts);
router.get(
  "/getSingleCategory/:category",
  productController.getProductByCategoryService
);
router.get("/getNewArrivals", productController.getNewArrivalsProductsService);
router.get("/getBestSelling", productController.getBestSellingProductsService);
router.get("/getSellerBestSelling/:userId", productController.getSellerBestSellingProductsService);


router.get("/getWishlist-product/:userId", productController.getWishlistedProductsService);
router.put(
  "/update/wishList/:productId",
  productController.updateWishlistedProductsService
);
router.put("/remove/wishList", productController.removeProductsWishlist);
// New route for product statistics

router.put("/addReview/:productId", productController.addReviewToProduct);
router.get("/stats/:userId", productController.getProductStats); 

// Inventory status
router.get("/inventory-status/:userId", productController.getInventoryStatus);

// Single product inventory status route
router.get("/inventory/:productId", productController.handleGetInventoryStatus);
router.patch("/updateQuantity/:productId", productController.handleUpdateQuantity);

// Single product statistics route
router.get("/product-stats/:productId", productController.handleGetSingleProductStats);

export const productRoutes = router;
