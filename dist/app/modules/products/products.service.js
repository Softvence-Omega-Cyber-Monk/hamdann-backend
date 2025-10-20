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
exports.productService = exports.addProductReviewService = void 0;
const products_model_1 = require("./products.model");
const order_model_1 = require("../order/order.model");
const cloudinary_1 = require("../../utils/cloudinary");
const user_schema_1 = require("../user/user.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const notificationHelper_1 = require("../../utils/notificationHelper");
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
    console.log('product', payload);
    const exitUser = yield user_schema_1.User_Model.findById({ _id: userId });
    if (!exitUser) {
        throw new Error("User not found");
    }
    if (exitUser.role !== "Seller") {
        throw new Error("Only sellers can add products");
    }
    if (exitUser.isPaidPlan === false) {
        throw new Error("Please take any subscription");
    }
    if (!exitUser.productAddedPowerQuantity) {
        throw new Error("Please subscribe to a plan to add products");
    }
    // Check if user has unlimited power or remaining power > 0
    if (exitUser.productAddedPowerQuantity !== "unlimited") {
        const currentProductCount = yield products_model_1.Product.countDocuments({ userId });
        if (currentProductCount >= exitUser.productAddedPowerQuantity) {
            throw new Error(`You have reached your product limit of ${exitUser.productAddedPowerQuantity}. Please upgrade your plan to add more products.`);
        }
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
    // Decrement productAddedPowerQuantity only if it's not "unlimited"
    if (exitUser.productAddedPowerQuantity !== "unlimited") {
        yield user_schema_1.User_Model.findByIdAndUpdate(userId, {
            $inc: { productAddedPowerQuantity: -1 }
        });
        console.log(`Product added. Remaining power: ${exitUser.productAddedPowerQuantity - 1}`);
    }
    // Notify all customers
    const customers = yield user_schema_1.User_Model.find({ role: "Buyer" });
    for (const buyer of customers) {
        yield (0, notificationHelper_1.sendNotification)(buyer._id.toString(), "🛒 New Product Added!", `${product.name} is now available!`);
    }
    return product;
});
const updateProductService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Handle multiple product images upload
    if (payload.productImagesFiles && payload.productImagesFiles.length > 0) {
        const imageUploadPromises = payload.productImagesFiles.map((file) => (0, cloudinary_1.uploadImgToCloudinary)(`product-${id}-${Date.now()}-${Math.random()}`, file.path, "product-images"));
        try {
            const uploadResults = yield Promise.all(imageUploadPromises);
            const imageUrls = uploadResults.map((result) => result.secure_url);
            // Append new images to existing ones
            if (payload.productImages && Array.isArray(payload.productImages)) {
                payload.productImages = [...payload.productImages, ...imageUrls];
            }
            else {
                payload.productImages = imageUrls;
            }
            delete payload.productImagesFiles;
        }
        catch (error) {
            throw new Error("Failed to upload product images");
        }
    }
    // Handle main image upload
    if (payload.mainImageFile) {
        try {
            const uploadResult = yield (0, cloudinary_1.uploadImgToCloudinary)(`product-${id}-main-${Date.now()}`, payload.mainImageFile.path, "product-images");
            payload.productImages = payload.productImages || [];
            if (payload.productImages.length > 0) {
                payload.productImages[0] = uploadResult.secure_url;
            }
            else {
                payload.productImages.push(uploadResult.secure_url);
            }
            delete payload.mainImageFile;
        }
        catch (error) {
            throw new Error("Failed to upload main image");
        }
    }
    const product = yield products_model_1.Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        throw new Error("Product not found");
    }
    return product;
});
const getAllProductsService = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, search = "") {
    try {
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        // Build search query
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: "i" }; // Case-insensitive search
        }
        // Execute queries in parallel for better performance
        const [products, totalProducts] = yield Promise.all([
            products_model_1.Product.find(query)
                .select("-reviews") // Exclude reviews if not needed
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            products_model_1.Product.countDocuments(query),
        ]);
        // Calculate pagination metadata
        const totalPages = Math.ceil(totalProducts / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        return {
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                hasNextPage,
                hasPrevPage,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null,
            },
        };
    }
    catch (error) {
        console.error("Error in getAllProductsService:", error);
        throw new Error("Failed to fetch products");
    }
});
const getSingleProductService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield products_model_1.Product.findById(id);
    return product;
});
const getSingleUserProductService = (userId_1, page_1, limit_1, ...args_1) => __awaiter(void 0, [userId_1, page_1, limit_1, ...args_1], void 0, function* (userId, page, limit, search = "") {
    const skip = (page - 1) * limit;
    // Build search query
    const query = { userId };
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    const [products, total] = yield Promise.all([
        products_model_1.Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        products_model_1.Product.countDocuments(query),
    ]);
    return {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
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
const getSellerBestSellingProductsService = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, options = {}) {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [bestSellingProducts, totalCount] = yield Promise.all([
        products_model_1.Product.find({ userId: userId })
            .sort({ salesCount: -1 })
            .skip(skip)
            .limit(limit),
        products_model_1.Product.countDocuments({ userId: userId }),
    ]);
    console.log("bestSellingProducts ", bestSellingProducts.length);
    const totalPages = Math.ceil(totalCount / limit);
    return {
        success: true,
        data: bestSellingProducts,
        pagination: {
            currentPage: page,
            totalPages,
            totalProducts: totalCount,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
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
        quantity: product.quantity + newQuantity,
        $inc: {
            salesCount: newQuantity < product.quantity ? product.quantity - newQuantity : 0,
        },
    }, { new: true });
    if (!updatedProduct) {
        throw new Error("Failed to update product quantity");
    }
    return {
        success: true,
        quantity: updatedProduct.quantity,
    };
});
const getSingleProductStats = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield products_model_1.Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    const orders = yield order_model_1.Order.find({
        "items.productId": productId,
    });
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((order) => order.status === "delivered").length;
    const conversionRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;
    let totalSales = 0;
    let revenue = 0;
    orders.forEach((order) => {
        if (order.status === "delivered") {
            const productItem = order.items.find((item) => item.productId.toString() === productId.toString());
            if (productItem) {
                totalSales += productItem.quantity;
                revenue += productItem.quantity * productItem.price;
            }
        }
    });
    const growthPercentage = 12;
    return {
        totalSales,
        revenue,
        totalOrders,
        deliveredOrders,
        conversionRate: Number(conversionRate.toFixed(2)),
    };
});
exports.productService = {
    createProductService,
    updateProductService,
    getAllProductsService,
    getSingleProductService,
    getSingleUserProductService,
    getProductByCategoryService,
    getNewArrivalsProductsService,
    getBestSellingProductsService,
    getSellerBestSellingProductsService,
    getProductStatsService,
    addProductReviewService: exports.addProductReviewService,
    getInventoryStatusService,
    getInventoryStatusForSingleProduct,
    updateProductQuantity,
    getSingleProductStats,
};
