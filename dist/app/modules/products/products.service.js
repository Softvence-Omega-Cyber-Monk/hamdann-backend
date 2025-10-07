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
const removeProductsWishlist = (productIds) => __awaiter(void 0, void 0, void 0, function* () {
    // Set `isWishlisted` to false for multiple products
    console.log('Product IDs to update:', productIds);
    const result = yield products_model_1.Product.updateMany({ _id: { $in: productIds } }, { $set: { isWishlisted: false } });
    console.log('Update result:', result);
    // Return updated products
    const updatedProducts = yield products_model_1.Product.find({ _id: { $in: productIds } });
    return updatedProducts;
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
    removeProductsWishlist,
};
