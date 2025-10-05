import express from "express";
import { productController } from "./products.controller";


const router = express.Router();

router.post("/create", productController.createProduct);          // ✅ Create product
router.put("/update/:id", productController.updateProduct);        // ✅ Update product
router.get("/getAll", productController.getAllProducts);          // ✅ Get all products
router.get("/getSingle/:id", productController.getSingleProduct);     // ✅ Get single product
router.get("/getSingleCategory/:category", productController.getProductByCategoryService);     
router.get("/getNewArrivals", productController.getNewArrivalsProductsService);     
router.get("/getBestSelling", productController.getBestSellingProductsService);   

export const productRoutes = router;
