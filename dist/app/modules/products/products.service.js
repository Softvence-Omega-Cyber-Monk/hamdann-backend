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
exports.productService = void 0;
const products_model_1 = require("./products.model");
const createProductService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('product payload in service ', payload);
    const product = yield products_model_1.Product.create(payload);
    return product;
});
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
const getProductByCategoryService = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield products_model_1.Product.find({ category: category });
    return product;
});
const getNewArrivalsProductsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const newArrivals = yield products_model_1.Product.find({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Filter for the last 30 days
    }).sort({ createdAt: -1 }); // Sort by creation date in descending order (most recent first)
    return newArrivals;
});
const getBestSellingProductsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const bestSellingProducts = yield products_model_1.Product.find()
        .sort({ salesCount: -1 }) // Sort by salesCount in descending order (highest first)
        .limit(10); // Limit the result to top 10 best sellers (you can adjust the number as needed)
    return bestSellingProducts;
});
const getWishlistedProductsService = (productId, isWishlisted) => __awaiter(void 0, void 0, void 0, function* () {
    const wishListedProducts = yield products_model_1.Product.findOneAndUpdate({ _id: productId }, { isWishlisted: isWishlisted }, { new: true }); // Return the updated document
    return wishListedProducts;
});
// Product statistics
const getProductStatsService = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Total Products count
    const totalProducts = yield products_model_1.Product.countDocuments();
    // Total Variations - sum of variations array lengths across all products
    const variationsResult = yield products_model_1.Product.aggregate([
        {
            $project: {
                variationsCount: { $size: { $ifNull: ["$variations", []] } }
            }
        },
        {
            $group: {
                _id: null,
                totalVariations: { $sum: "$variationsCount" }
            }
        }
    ]);
    const totalVariations = ((_a = variationsResult[0]) === null || _a === void 0 ? void 0 : _a.totalVariations) || 0;
    // Total Units - sum of quantity across all products
    const unitsResult = yield products_model_1.Product.aggregate([
        {
            $group: {
                _id: null,
                totalUnits: { $sum: "$quantity" }
            }
        }
    ]);
    const totalUnits = ((_b = unitsResult[0]) === null || _b === void 0 ? void 0 : _b.totalUnits) || 0;
    // Active Products (quantity > 0)
    const activeProducts = yield products_model_1.Product.countDocuments({ quantity: { $gt: 0 } });
    // Out of Stock Products (quantity = 0)
    const outOfStock = yield products_model_1.Product.countDocuments({ quantity: 0 });
    return {
        totalProducts,
        totalVariations,
        // totalUnits,
        activeProducts,
        outOfStock
    };
});
exports.productService = {
    createProductService,
    updateProductService,
    getAllProductsService,
    getSingleProductService,
    getProductByCategoryService,
    getNewArrivalsProductsService,
    getBestSellingProductsService,
    getWishlistedProductsService,
    getProductStatsService,
};
