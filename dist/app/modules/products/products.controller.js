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
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.addReviewToProduct = exports.createProduct = void 0;
const products_service_1 = require("./products.service");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Uploaded file(s):", req.file || req.files);
        const singleFile = req.file;
        const multipleFiles = req.files;
        const product = yield products_service_1.productService.createProductService(req.body, singleFile || multipleFiles // Pass whichever exists
        );
        res.status(201).json({ success: true, data: product });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield products_service_1.productService.updateProductService(id, req.body);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_service_1.productService.getAllProductsService();
        res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield products_service_1.productService.getSingleProductService(id);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const getProductByCategoryService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        const product = yield products_service_1.productService.getProductByCategoryService(category);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Products not found" });
        }
        res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const getNewArrivalsProductsService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield products_service_1.productService.getNewArrivalsProductsService();
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Products not found" });
        }
        res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const getBestSellingProductsService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield products_service_1.productService.getBestSellingProductsService();
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Products not found" });
        }
        res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const getWishlistedProductsService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { isWishlisted } = req.body;
        const product = yield products_service_1.productService.getWishlistedProductsService(productId, isWishlisted);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Products not found" });
        }
        res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const removeProductsWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productIds } = req.body;
        console.log("Received product IDs:", productIds);
        const product = yield products_service_1.productService.removeProductsWishlist(productIds);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Products not found" });
        }
        res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const getProductStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield products_service_1.productService.getProductStatsService();
        res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
const addReviewToProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        // Basic validation
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }
        const updatedProduct = yield products_service_1.productService.addProductReviewService(productId, { rating, comment });
        res.status(200).json({
            success: true,
            message: "Review added successfully",
            data: updatedProduct,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.addReviewToProduct = addReviewToProduct;
exports.productController = {
    createProduct: exports.createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    getProductByCategoryService,
    getNewArrivalsProductsService,
    getBestSellingProductsService,
    getWishlistedProductsService,
    removeProductsWishlist,
    getProductStats,
    addReviewToProduct: exports.addReviewToProduct
};
