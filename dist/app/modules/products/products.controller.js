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
exports.productController = exports.addReviewToProduct = void 0;
const products_service_1 = require("./products.service");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Uploaded file(s):", req.file || req.files);
        console.log("hit thit hist eindex");
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
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const files = req.files;
        const updateData = Object.assign(Object.assign(Object.assign({}, req.body), ((files === null || files === void 0 ? void 0 : files.productImages) && { productImagesFiles: files.productImages })), (((_a = files === null || files === void 0 ? void 0 : files.mainImage) === null || _a === void 0 ? void 0 : _a[0]) && { mainImageFile: files.mainImage[0] }));
        const product = yield products_service_1.productService.updateProductService(id, updateData);
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
        // Get query parameters with default values
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const search = req.query.search || "";
        // Validate pagination parameters
        if (page < 1) {
            res.status(400).json({
                success: false,
                message: "Page must be a positive number",
            });
            return;
        }
        if (limit < 1 || limit > 100) {
            res.status(400).json({
                success: false,
                message: "Limit must be between 1 and 100",
            });
            return;
        }
        const result = yield products_service_1.productService.getAllProductsService(page, limit, search);
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: result.products,
            pagination: result.pagination,
        });
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
const getSingleUserProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const search = req.query.search || "";
        const result = yield products_service_1.productService.getSingleUserProductService(userId, page, limit, search);
        res.status(200).json({
            success: true,
            data: result.products,
            pagination: result.pagination,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
const getProductByCategoryService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        const { sort, search, page, limit } = req.query;
        const result = yield products_service_1.productService.getProductByCategoryService(category, {
            sort: sort,
            search: search,
            page: Number(page),
            limit: Number(limit),
        });
        if (!result.products.length) {
            return res
                .status(404)
                .json({ success: false, message: "No products found" });
        }
        res.status(200).json({ success: true, data: result });
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
const getSellerBestSellingProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { page, limit, sea } = req.query;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        const pageNumber = page ? parseInt(page) : null;
        const limitNumber = limit ? parseInt(limit) : null;
        const result = yield products_service_1.productService.getSellerBestSellingProductsService(userId, {
            page: pageNumber,
            limit: limitNumber
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching seller best selling products:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch best selling products"
        });
    }
});
const getProductStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Assuming auth middleware sets req.user._id
        const { userId } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const stats = yield products_service_1.productService.getProductStatsService(userId);
        res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server Error",
        });
    }
});
const addReviewToProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.body.userId; // Assuming userId is sent in the request body
        // Basic validation
        if (!rating || rating < 1 || rating > 5) {
            return res
                .status(400)
                .json({ success: false, message: "Rating must be between 1 and 5" });
        }
        const updatedProduct = yield products_service_1.productService.addProductReviewService(productId, userId, { rating, comment });
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
const getInventoryStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const inventoryStatus = yield products_service_1.productService.getInventoryStatusService(userId);
        res.status(200).json({
            success: true,
            data: inventoryStatus,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
// Get inventory status for a specific product
const handleGetInventoryStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        if (!productId) {
            res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
            return;
        }
        const inventoryStatus = yield products_service_1.productService.getInventoryStatusForSingleProduct(productId);
        res.status(200).json({
            success: true,
            data: inventoryStatus,
        });
    }
    catch (error) {
        if (error.message === "Product not found") {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Failed to get inventory status",
            });
        }
    }
});
// Update product quantity
const handleUpdateQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!productId) {
            res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
            return;
        }
        const result = yield products_service_1.productService.updateProductQuantity(productId, quantity);
        res.status(200).json({
            success: true,
            message: "Quantity updated successfully",
            data: result,
        });
    }
    catch (error) {
        if (error.message === "Product not found") {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        else if (error.message.includes("Quantity cannot be negative")) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Failed to update quantity",
            });
        }
    }
});
// Get single product statistics
const handleGetSingleProductStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { startDate, endDate } = req.query;
        if (!productId) {
            res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
            return;
        }
        const stats = yield products_service_1.productService.getSingleProductStats(productId);
        res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        if (error.message === "Product not found") {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Failed to get product statistics",
            });
        }
    }
});
exports.productController = {
    createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    getSingleUserProduct,
    getProductByCategoryService,
    getNewArrivalsProductsService,
    getBestSellingProductsService,
    getSellerBestSellingProductsController,
    getProductStats,
    addReviewToProduct: exports.addReviewToProduct,
    getInventoryStatus,
    handleGetInventoryStatus,
    handleUpdateQuantity,
    handleGetSingleProductStats,
};
