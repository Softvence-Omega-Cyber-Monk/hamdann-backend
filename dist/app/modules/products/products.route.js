"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("./products.controller");
const cloudinary_1 = require("../../utils/cloudinary");
const router = express_1.default.Router();
router.post("/create", cloudinary_1.upload.any(), products_controller_1.productController.createProduct); // ✅ Create product
router.put("/update/:id", products_controller_1.productController.updateProduct); // ✅ Update product
// ✅ Get all products
router.get("/getSingle/:id", products_controller_1.productController.getSingleProduct); // ✅ Get single product
router.get("/getAll", products_controller_1.productController.getAllProducts);
router.get("/getSingleCategory/:category", products_controller_1.productController.getProductByCategoryService);
router.get("/getNewArrivals", products_controller_1.productController.getNewArrivalsProductsService);
router.get("/getBestSelling", products_controller_1.productController.getBestSellingProductsService);
router.put("/update/wishList/:productId", products_controller_1.productController.getWishlistedProductsService);
router.put("/remove/wishList", products_controller_1.productController.removeProductsWishlist);
// New route for product statistics
router.get("/stats", products_controller_1.productController.getProductStats);
router.put("/addReview/:productId", products_controller_1.productController.addReviewToProduct);
exports.productRoutes = router;
