import express from "express";
import { productController } from "./products.controller";


const router = express.Router();

router.post("/create", productController.createProduct);          // ✅ Create product
router.put("/update/:id", productController.updateProduct);        // ✅ Update product
router.get("/getAll", productController.getAllProducts);          // ✅ Get all products
router.get("/getSingle/:id", productController.getSingleProduct);     // ✅ Get single product

export const productRoutes = router;
