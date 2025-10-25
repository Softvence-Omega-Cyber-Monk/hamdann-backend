"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("./products.controller");
const cloudinary_1 = require("../../utils/cloudinary");
const subscriptionCheck_1 = require("../../middlewares/subscriptionCheck");
const router = express_1.default.Router();
router.post("/create", cloudinary_1.upload.any(), subscriptionCheck_1.checkUserSubscription, products_controller_1.productController.createProduct); // ✅ Create product
// router.put("/update/:id", productController.updateProduct); // ✅ Update product
router.put("/update/:id", cloudinary_1.upload.fields([
    { name: "productImages", maxCount: 10 },
    { name: "mainImage", maxCount: 1 },
]), products_controller_1.productController.updateProduct);
// ✅ Get all products
router.get("/getSingle/:id", products_controller_1.productController.getSingleProduct); // ✅ Get single product
router.get("/getUserProduct/:userId", products_controller_1.productController.getSingleUserProduct); // ✅ Get single product
router.get("/getAll", products_controller_1.productController.getAllProducts);
router.get("/getSingleCategory/:category", products_controller_1.productController.getProductByCategoryService);
router.get("/getNewArrivals", products_controller_1.productController.getNewArrivalsProductsService);
router.get("/getBestSelling", products_controller_1.productController.getBestSellingProductsService);
router.get("/getSellerBestSelling/:userId", products_controller_1.productController.getSellerBestSellingProductsController);
router.put("/addReview/:productId", products_controller_1.productController.addReviewToProduct);
router.get("/stats/:userId", products_controller_1.productController.getProductStats);
// Inventory status
router.get("/inventory-status/:userId", products_controller_1.productController.getInventoryStatus);
// Single product inventory status route
router.get("/inventory/:productId", products_controller_1.productController.handleGetInventoryStatus);
router.patch("/updateQuantity/:productId", products_controller_1.productController.handleUpdateQuantity);
// Single product statistics route
router.get("/product-stats/:productId", products_controller_1.productController.handleGetSingleProductStats);
router.get("/sales-trends/:sellerId", products_controller_1.productController.getSalesTrendsController);
exports.productRoutes = router;
