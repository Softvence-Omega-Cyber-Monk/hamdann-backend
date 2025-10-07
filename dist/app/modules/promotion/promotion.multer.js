"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promotionUpload = void 0;
const multer_1 = __importDefault(require("multer"));
// Memory storage for Cloudinary
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith("image/"))
        cb(null, true);
    else
        cb(new Error("Only image files are allowed!"));
};
exports.promotionUpload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
