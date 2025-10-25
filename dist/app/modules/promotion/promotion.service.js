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
exports.getSingleSellerPromotionAnalyticsService = exports.getPromotionAnalyticsService = exports.incrementView = exports.getSellerPromotionsService = exports.updatePromotionService = exports.getAllPromotionsService = exports.getPromotionService = exports.createPromotionService = void 0;
const promotion_model_1 = require("./promotion.model");
const products_model_1 = require("../products/products.model");
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("../order/order.model");
// ✅ CREATE PROMOTION SERVICE
const createPromotionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log("Initial Payload:", payload);
    let applicableProducts = [];
    // 🔹 Case 1: Apply to all products
    if (payload.applicableType === "allProducts") {
        const all = yield products_model_1.Product.find({ userId: payload.sellerId }, "_id");
        applicableProducts = all.map((p) => p._id);
        payload.allProducts = applicableProducts;
        payload.specificProducts = []; // ✅ clear others
        payload.productCategories = [];
    }
    // 🔹 Case 2: Apply to specific products
    // 🔹 Case 2: Apply to specific products
    else if (payload.applicableType === "specificProducts" &&
        ((_a = payload.specificProducts) === null || _a === void 0 ? void 0 : _a.length)) {
        payload.allProducts = payload.specificProducts; // ✅ unify
        payload.productCategories = [];
    }
    // 🔹 Case 3: Apply to product categories
    else if (payload.applicableType === "productCategories" &&
        ((_b = payload.productCategories) === null || _b === void 0 ? void 0 : _b.length)) {
        const categoryProducts = yield products_model_1.Product.find({
            category: { $in: payload.productCategories },
            userId: payload.sellerId,
        }, "_id");
        applicableProducts = categoryProducts.map((p) => p._id);
        payload.allProducts = applicableProducts;
        payload.specificProducts = []; // ✅ clear others
    }
    // ✅ Create promotion
    const promotion = yield promotion_model_1.PromotionModel.create(payload);
    // ✅ Apply discount to all applicable products
    if ((_c = promotion.allProducts) === null || _c === void 0 ? void 0 : _c.length) {
        const { promotionType, discountValue } = promotion;
        const products = yield products_model_1.Product.find({
            _id: { $in: promotion.allProducts },
        });
        for (const product of products) {
            let newPrice = product.price;
            if (promotionType === "percentage") {
                newPrice = product.price - (product.price * discountValue) / 100;
            }
            else if (promotionType === "fixed") {
                newPrice = Math.max(product.price - discountValue, 0);
            }
            yield products_model_1.Product.findByIdAndUpdate(product._id, {
                $set: {
                    newPrice, // ✅ discounted price
                    discountType: promotionType,
                    discountValue: discountValue,
                    isNewArrival: false, // optional: disable new arrival flag
                },
            });
        }
    }
    return promotion;
});
exports.createPromotionService = createPromotionService;
// ✅ GET SINGLE PROMOTION
const getPromotionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new Error("Invalid Promotion ID");
    const promotion = yield promotion_model_1.PromotionModel.findById(id)
        .populate("allProducts specificProducts", "name price newPrice discountType discountValue category productImages  reviews  averageRating")
        .exec();
    if (!promotion)
        throw new Error("Promotion not found");
    return promotion;
});
exports.getPromotionService = getPromotionService;
// ✅ GET ALL PROMOTIONS
const getAllPromotionsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield promotion_model_1.PromotionModel.find()
        .sort({ createdAt: -1 })
        .populate("allProducts specificProducts", "name price newPrice discountType discountValue category productImages  reviews  averageRating")
        .exec();
});
exports.getAllPromotionsService = getAllPromotionsService;
// ✅ UPDATE PROMOTION
const updatePromotionService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new Error("Invalid Promotion ID");
    const promotion = yield promotion_model_1.PromotionModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!promotion)
        throw new Error("Promotion not found");
    return promotion;
});
exports.updatePromotionService = updatePromotionService;
// ✅ GET SELLER PROMOTIONS
const getSellerPromotionsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching promotions for userId:", userId);
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID");
    }
    // In real use, filter promotions by seller’s products
    return yield promotion_model_1.PromotionModel.find({ isActive: true, sellerId: userId } // Filter by sellerId
    )
        .sort({ endDate: 1 })
        .populate("allProducts specificProducts", "name price category productImages  reviews  averageRating");
});
exports.getSellerPromotionsService = getSellerPromotionsService;
const incrementView = (promotionId) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield promotion_model_1.PromotionModel.findByIdAndUpdate(promotionId, { $inc: { totalView: 1 } }, { new: true });
    return updated;
});
exports.incrementView = incrementView;
//get single promotion analytis
const getPromotionAnalyticsService = (promotionId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const promotion = yield promotion_model_1.PromotionModel.findById(promotionId);
    // console.log('promotion', promotion)
    if (!promotion)
        throw new Error("Promotion not found");
    // ✅ Determine which products are included
    let productIds = [];
    if (promotion.applicableType === "allProducts") {
        productIds = promotion.allProducts || [];
    }
    else if (promotion.applicableType === "specificProducts") {
        productIds = promotion.specificProducts || [];
    }
    else if (promotion.applicableType === "productCategories") {
        const products = yield products_model_1.Product.find({
            category: { $in: promotion.productCategories },
        }).select("_id");
        productIds = products.map((p) => p._id);
    }
    const topPerformingProduct = yield products_model_1.Product.find({
        _id: { $in: productIds },
    }).sort({ salesCount: -1 });
    console.log("procuts0", topPerformingProduct);
    // ✅ Aggregate orders for those products
    const orderStats = yield order_model_1.Order.aggregate([
        { $unwind: "$items" },
        { $match: { "items.productId": { $in: productIds } } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
                totalOrders: { $sum: 1 },
                totalQuantity: { $sum: "$items.quantity" },
            },
        },
    ]);
    console.log("order start", orderStats);
    const totalRevenue = ((_a = orderStats[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0;
    const totalOrders = ((_b = orderStats[0]) === null || _b === void 0 ? void 0 : _b.totalOrders) || 0;
    // console.log(totalOrders, "total order");
    // ✅ Derived analytics
    const totalViews = promotion.totalView || 0;
    const redemptionRate = totalViews > 0 ? ((totalOrders / totalViews) * 100).toFixed(2) : "0";
    // ✅ Monthly analytics
    const monthlyStats = yield order_model_1.Order.aggregate([
        { $unwind: "$items" },
        { $match: { "items.productId": { $in: productIds } } },
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalRevenue: { $sum: "$totalAmount" },
                totalSales: { $sum: "$items.quantity" },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    // console.log("monthly", monthlyStats);
    return {
        promotionName: promotion === null || promotion === void 0 ? void 0 : promotion.promotionName,
        totalViews,
        salesGenerated: totalRevenue,
        redemptionRate: `${redemptionRate}%`,
        monthlyStats,
        topPerformingProduct: topPerformingProduct
    };
});
exports.getPromotionAnalyticsService = getPromotionAnalyticsService;
// single seller promotion analytis
const getSingleSellerPromotionAnalyticsService = (selllerId) => __awaiter(void 0, void 0, void 0, function* () {
    const promotion = yield promotion_model_1.PromotionModel.findOne({ sellerId: selllerId });
    // console.log('promotion', promotion)
    if (!promotion)
        throw new Error("Promotion not found");
    // ✅ Determine which products are included
    let productIds = [];
    if (promotion.applicableType === "allProducts") {
        productIds = promotion.allProducts || [];
    }
    else if (promotion.applicableType === "specificProducts") {
        productIds = promotion.specificProducts || [];
    }
    else if (promotion.applicableType === "productCategories") {
        const products = yield products_model_1.Product.find({
            category: { $in: promotion.productCategories },
        }).select("_id");
        productIds = products.map((p) => p._id);
    }
    // ✅ Monthly analytics
    const monthlyStats = yield order_model_1.Order.aggregate([
        { $unwind: "$items" },
        { $match: { "items.productId": { $in: productIds } } },
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalRevenue: { $sum: "$totalAmount" },
                totalSales: { $sum: "$items.quantity" },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    return {
        monthlyStats,
    };
});
exports.getSingleSellerPromotionAnalyticsService = getSingleSellerPromotionAnalyticsService;
