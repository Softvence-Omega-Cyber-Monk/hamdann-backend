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
exports.getSellerPromotions = exports.pausePromotion = exports.updatePromotion = exports.getAllPromotions = exports.getPromotion = exports.createPromotion = void 0;
const promotion_validation_1 = require("./promotion.validation");
const promotion_service_1 = require("./promotion.service");
const cloudinary_1 = require("cloudinary");
const configs_1 = require("../../configs");
cloudinary_1.v2.config({
    cloud_name: configs_1.configs.cloudinary.cloud_name,
    api_key: configs_1.configs.cloudinary.cloud_api_key,
    api_secret: configs_1.configs.cloudinary.cloud_api_secret,
});
// ✅ CREATE PROMOTION
const createPromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validatedData = promotion_validation_1.CreatePromotionSchema.parse(req.body);
        let imageUrl = "";
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) {
            const result = yield new Promise((resolve, reject) => {
                var _a;
                const stream = cloudinary_1.v2.uploader.upload_stream({ folder: "promotions" }, (error, result) => (error ? reject(error) : resolve(result)));
                stream.end((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer);
            });
            imageUrl = result.secure_url;
        }
        const dataToSave = Object.assign(Object.assign({}, validatedData), { startDate: new Date(validatedData.startDate), endDate: new Date(validatedData.endDate), promotionImage: imageUrl });
        const promotion = yield (0, promotion_service_1.createPromotionService)(dataToSave);
        res.status(201).json({ success: true, data: promotion });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createPromotion = createPromotion;
// ✅ GET SINGLE PROMOTION
const getPromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const promotion = yield (0, promotion_service_1.getPromotionService)(id);
        res.status(200).json({ success: true, data: promotion });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});
exports.getPromotion = getPromotion;
// ✅ GET ALL PROMOTIONS
const getAllPromotions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotions = yield (0, promotion_service_1.getAllPromotionsService)();
        res.status(200).json({ success: true, data: promotions });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAllPromotions = getAllPromotions;
// ✅ UPDATE PROMOTION
const updatePromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const validatedData = promotion_validation_1.UpdatePromotionSchema.parse(req.body);
        let imageUrl;
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) {
            const result = yield new Promise((resolve, reject) => {
                var _a;
                const upload = cloudinary_1.v2.uploader.upload_stream({ folder: "promotions" }, (error, result) => (error ? reject(error) : resolve(result)));
                upload.end((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer);
            });
            imageUrl = result.secure_url;
        }
        const dataToUpdate = Object.assign(Object.assign(Object.assign(Object.assign({}, validatedData), (validatedData.startDate && {
            startDate: new Date(validatedData.startDate),
        })), (validatedData.endDate && {
            endDate: new Date(validatedData.endDate),
        })), (imageUrl && { promotionImage: imageUrl }));
        const updatedPromotion = yield (0, promotion_service_1.updatePromotionService)(id, dataToUpdate);
        res.status(200).json({
            success: true,
            message: "Promotion updated successfully",
            data: updatedPromotion,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updatePromotion = updatePromotion;
// ✅ PAUSE PROMOTION
const pausePromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedPromotion = yield (0, promotion_service_1.updatePromotionService)(id, {
            isActive: false,
        });
        res.status(200).json({
            success: true,
            message: "Promotion paused successfully",
            data: updatedPromotion,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.pausePromotion = pausePromotion;
// ✅ GET PROMOTIONS BY SELLER
const getSellerPromotions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId)
            return res
                .status(400)
                .json({ success: false, message: "User ID is required" });
        const promotions = yield (0, promotion_service_1.getSellerPromotionsService)(userId);
        res.status(200).json({ success: true, data: promotions });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getSellerPromotions = getSellerPromotions;
