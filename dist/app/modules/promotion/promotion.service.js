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
exports.getSellerPromotionsService = exports.updatePromotionService = exports.getAllPromotionsService = exports.getPromotionService = exports.createPromotionService = void 0;
const promotion_model_1 = require("./promotion.model");
const products_model_1 = require("../products/products.model"); // Import your Product model
const mongoose_1 = __importDefault(require("mongoose"));
// Create a promotion
const createPromotionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Optional: validate product IDs exist
    if ((_a = payload.allProducts) === null || _a === void 0 ? void 0 : _a.length) {
        const existing = yield products_model_1.Product.find({ _id: { $in: payload.allProducts } });
        if (existing.length !== payload.allProducts.length) {
            throw new Error("Some products in allProducts do not exist");
        }
    }
    if ((_b = payload.specificProducts) === null || _b === void 0 ? void 0 : _b.length) {
        const existing = yield products_model_1.Product.find({
            _id: { $in: payload.specificProducts },
        });
        if (existing.length !== payload.specificProducts.length) {
            throw new Error("Some products in specificProducts do not exist");
        }
    }
    const promotion = yield promotion_model_1.PromotionModel.create(payload);
    // const customers = await User_Model.find({ role: "Buyer" });
    // for (const buyer of customers) {
    //   await sendNotification(
    //     buyer._id.toString(),
    //     "🛒 New Order Added!",
    //     ` is now available!`
    //   );
    // }
    return promotion;
});
exports.createPromotionService = createPromotionService;
// Get single promotion by ID
const getPromotionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid Promotion ID");
    }
    const promotion = yield promotion_model_1.PromotionModel.findById(id)
        .populate("allProducts", "specificProducts")
        .exec();
    if (!promotion) {
        throw new Error("Promotion not found");
    }
    return promotion;
});
exports.getPromotionService = getPromotionService;
// Get all promotions
const getAllPromotionsService = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("Service hit ")
    // No try-catch needed; let controller handle errors
    const promotion = yield promotion_model_1.PromotionModel.find()
        .sort({ createdAt: -1 })
        .populate("allProducts", "specificProducts")
        .exec();
    //   console.log("Promotion", promotion);
    return promotion;
});
exports.getAllPromotionsService = getAllPromotionsService;
// ✅ Update promotion
const updatePromotionService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid Promotion ID");
    }
    const promotion = yield promotion_model_1.PromotionModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!promotion) {
        throw new Error("Promotion not found");
    }
    return promotion;
});
exports.updatePromotionService = updatePromotionService;
// Inventory status
const getSellerPromotionsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all promotions that are active and return required fields
    const promotions = yield promotion_model_1.PromotionModel.find({ isActive: true }, {
        promotionName: 1,
        endDate: 1,
        discountValue: 1,
        isActive: 1,
        promotionType: 1,
        _id: 1
    }).sort({ endDate: 1 });
    return promotions;
});
exports.getSellerPromotionsService = getSellerPromotionsService;
