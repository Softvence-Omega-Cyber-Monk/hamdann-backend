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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.addProductReviewService = exports.createProductService = void 0;
const products_model_1 = require("./products.model");
const cloudinary_1 = require("../../utils/cloudinary");
const user_schema_1 = require("../user/user.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const shopReview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield products_model_1.Product.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
        { $unwind: "$reviews" },
        {
            $group: {
                _id: "$userId",
                averageRating: { $avg: "$reviews.rating" },
                totalReviews: { $sum: 1 },
            },
        },
    ]);
    return reviews;
});
const createProductService = (payload, imageInput) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { userId } = payload;
    const exitUser = yield user_schema_1.User_Model.findById({ _id: userId });
    if (!exitUser) {
        throw new Error("User not found");
    }
    if (exitUser.role !== "Seller") {
        throw new Error("Only sellers can add products");
    }
    const shopReviews = yield shopReview(userId);
    console.log("shopReviews ", shopReviews);
    let imageUrls = [];
    if (Array.isArray(imageInput)) {
        // Multiple images
        const filePaths = imageInput.map((file) => file.path);
        imageUrls = yield (0, cloudinary_1.uploadMultipleImages)(filePaths, "Products");
    }
    else if (imageInput) {
        // Single image
        const result = yield (0, cloudinary_1.uploadImgToCloudinary)(imageInput.filename, imageInput.path, "Products");
        imageUrls = [result.secure_url];
    }
    const productPayload = Object.assign(Object.assign({}, payload), { shopName: ((_a = exitUser.businessInfo) === null || _a === void 0 ? void 0 : _a.businessName) || null, shopReviews: (_b = shopReviews[0]) === null || _b === void 0 ? void 0 : _b.averageRating, productImages: imageUrls });
    const product = yield products_model_1.Product.create(productPayload);
    // Notify all customers
    // const customers = await User_Model.find({ role: "Seller" });
    // for (const user of customers) {
    //   await sendNotification(
    //     user._id.toString(),
    //     "🛒 New Product Added!",
    //     `${product.name} is now available!`
    //   );
    // }
    return product;
});
exports.createProductService = createProductService;
const updateProductService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('update payload in service ', payload);
    const product = yield products_model_1.Product.findByIdAndUpdate(id, payload, { new: true });
    return product;
});
const getAllProductsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield products_model_1.Product.find();
    return products;
});
const getSingleProductService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield products_model_1.Product.findById(id);
    return product;
});
const getSingleUserProductService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield products_model_1.Product.find({ userId: userId });
    return product;
});
const getProductByCategoryService = (category_1, ...args_1) => __awaiter(void 0, [category_1, ...args_1], void 0, function* (category, options = {}) {
    const { sort, search, page = 1, limit = 10 } = options;
    const filter = { category };
    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }
    let sortQuery = {};
    if (sort) {
        const sortOptions = sort.split(",").map((s) => s.trim());
        sortOptions.forEach((option) => {
            if (option === "low-to-high") {
                sortQuery.price = 1;
            }
            else if (option === "high-to-low") {
                sortQuery.price = -1;
            }
            else if (option === "best-selling") {
                sortQuery.salesCount = -1;
            }
        });
    }
    // Pagination
    const skip = (page - 1) * limit;
    const products = yield products_model_1.Product.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .exec();
    const totalCategoryProduct = yield products_model_1.Product.countDocuments(filter);
    return {
        products,
        totalCategoryProduct,
        page,
        pages: Math.ceil(totalCategoryProduct / limit),
    };
});
const getNewArrivalsProductsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const newArrivals = yield products_model_1.Product.find({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Filter for the last 30 days
    }).sort({ createdAt: -1 });
    return newArrivals;
});
const getBestSellingProductsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const bestSellingProducts = yield products_model_1.Product.find().sort({ salesCount: -1 }); // Sort by salesCount in descending order (highest first)
    console.log("bestSellingProducts ", bestSellingProducts.length);
    return bestSellingProducts;
});
const getSellerBestSellingProductsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userId in service ", userId);
    const bestSellingProducts = yield products_model_1.Product.find({ userId: userId }).sort({
        salesCount: -1,
    }); // Sort by salesCount in descending order (highest first)
    console.log("bestSellingProducts ", bestSellingProducts.length);
    return bestSellingProducts;
});
const getWishlistedProductsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userid -------------0000 ", userId);
    const wishListedProducts = yield products_model_1.Product.find({
        isWishlisted: true,
        userId: userId,
    });
    console.log("wishListedProducts ", wishListedProducts.length);
    return wishListedProducts;
});
const updateWishlistedProductsService = (productId, isWishlisted) => __awaiter(void 0, void 0, void 0, function* () {
    const wishListedProducts = yield products_model_1.Product.findOneAndUpdate({ _id: productId }, { isWishlisted: isWishlisted }, { new: true }); // Return the updated document
    return wishListedProducts;
});
const removeProductsWishlist = (productIds) => __awaiter(void 0, void 0, void 0, function* () {
    // Set `isWishlisted` to false for multiple products
    console.log("Product IDs to update:", productIds);
    const result = yield products_model_1.Product.updateMany({ _id: { $in: productIds } }, { $set: { isWishlisted: false } });
    console.log("Update result:", result);
    // Return updated products
    const updatedProducts = yield products_model_1.Product.find({ _id: { $in: productIds } });
    return updatedProducts;
    // Product statistics
});
const getProductStatsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    const totalProducts = yield products_model_1.Product.countDocuments({ userId: userObjectId });
    const variationsResult = yield products_model_1.Product.aggregate([
        { $match: { userId: userObjectId } },
        {
            $project: {
                variationsCount: { $size: { $ifNull: ["$variations", []] } },
            },
        },
        {
            $group: {
                _id: null,
                totalVariations: { $sum: "$variationsCount" },
            },
        },
    ]);
    const totalVariations = ((_a = variationsResult[0]) === null || _a === void 0 ? void 0 : _a.totalVariations) || 0;
    const unitsResult = yield products_model_1.Product.aggregate([
        { $match: { userId: userObjectId } },
        {
            $group: {
                _id: null,
                totalUnits: { $sum: "$quantity" },
            },
        },
    ]);
    const totalUnits = ((_b = unitsResult[0]) === null || _b === void 0 ? void 0 : _b.totalUnits) || 0;
    const activeProducts = yield products_model_1.Product.countDocuments({
        userId: userObjectId,
        quantity: { $gt: 0 },
    });
    const outOfStock = yield products_model_1.Product.countDocuments({
        userId: userObjectId,
        quantity: 0,
    });
    return {
        totalProducts,
        totalVariations,
        // totalUnits,
        activeProducts,
        outOfStock,
    };
});
const addProductReviewService = (productId, userId, review) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("dkfsdlf", userId, review);
    const existingUser = yield user_schema_1.User_Model.findById({ _id: userId });
    const product = (yield products_model_1.Product.findById(productId));
    if (!product) {
        throw new Error("Product not found");
    }
    const reviewData = Object.assign(Object.assign({}, review), { userId: existingUser === null || existingUser === void 0 ? void 0 : existingUser.name });
    console.log("reaq ", reviewData);
    // Add the new review
    product.reviews.push(reviewData);
    // Update average rating
    const totalReviews = product.reviews.length;
    const totalRating = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    product.averageRating = totalRating / totalReviews;
    yield product.save();
    // ✅ Recalculate shop’s (seller’s) overall rating across all products
    const shopId = product.userId; // seller's ID
    const shopStats = yield products_model_1.Product.aggregate([
        {
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(shopId),
                "reviews.rating": { $exists: true, $ne: null },
            },
        },
        { $unwind: "$reviews" },
        {
            $group: {
                _id: "$userId",
                averageRating: { $avg: "$reviews.rating" },
                totalReviews: { $sum: 1 },
            },
        },
    ]);
    const shopAverageRating = ((_a = shopStats[0]) === null || _a === void 0 ? void 0 : _a.averageRating) || 0;
    const totalShopReviews = ((_b = shopStats[0]) === null || _b === void 0 ? void 0 : _b.totalReviews) || 0;
    // ✅ Update all products of that seller with the latest shop average rating
    const res = yield products_model_1.Product.updateMany({ userId: shopId }, {
        $set: {
            shopReviews: shopAverageRating,
        },
    });
    console.log("Updated products with new shop rating:", res);
    return product;
});
exports.addProductReviewService = addProductReviewService;
const getInventoryStatusService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    const inventoryStatus = yield products_model_1.Product.find({ userId: userObjectId }, { name: 1, quantity: 1, _id: 0 } // Only return name and quantity fields
    ).sort({ name: 1 }); // Sort by product name alphabetically
    return inventoryStatus;
});
// Get inventory status for a specific product
const getInventoryStatusForSingleProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield products_model_1.Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    // Calculate stock status based on quantity and threshold
    const calculateStockStatus = (quantity, lowStockThreshold) => {
        if (quantity === 0) {
            return "Out of Stock";
        }
        else if (quantity <= lowStockThreshold) {
            return "Low Stock";
        }
        else {
            return "In Stock";
        }
    };
    const lowStockThreshold = 50;
    const stockStatus = calculateStockStatus(product.quantity, lowStockThreshold);
    const formatDate = (date) => {
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };
    const lastRestock = product.updatedAt
        ? formatDate(product.updatedAt)
        : undefined;
    return {
        availableStock: product.quantity,
        stockStatus,
        lowStockThreshold,
        lastRestock,
        // needsRestock: product.quantity <= lowStockThreshold,
    };
});
// Update product quantity
const updateProductQuantity = (productId, newQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield products_model_1.Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative");
    }
    const updatedProduct = yield products_model_1.Product.findByIdAndUpdate(productId, {
        quantity: newQuantity,
        $inc: { salesCount: newQuantity < product.quantity ? product.quantity - newQuantity : 0 }
    }, { new: true });
    if (!updatedProduct) {
        throw new Error("Failed to update product quantity");
    }
    return {
        success: true,
        quantity: updatedProduct.quantity
    };
});
exports.productService = {
    createProductService: exports.createProductService,
    updateProductService,
    getAllProductsService,
    getSingleProductService,
    getSingleUserProductService,
    getProductByCategoryService,
    getNewArrivalsProductsService,
    getBestSellingProductsService,
    getSellerBestSellingProductsService,
    getWishlistedProductsService,
    updateWishlistedProductsService,
    removeProductsWishlist,
    getProductStatsService,
    addProductReviewService: exports.addProductReviewService,
    getInventoryStatusService,
    getInventoryStatusForSingleProduct,
    updateProductQuantity,
};
