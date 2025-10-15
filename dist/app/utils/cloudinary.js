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
exports.MultiUpload = exports.uploadMultiple = exports.uploadSingleforBusinessLogo = exports.uploadSingle = exports.upload = exports.deleteImageFromCloudinary = exports.uploadMultipleImages = exports.uploadImgToCloudinary = exports.deleteFile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
const configs_1 = require("../configs");
// -----------------------------
// 🧹 Delete local file
// -----------------------------
const deleteFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.unlink(filePath);
        console.log(`File deleted successfully: ${filePath}`);
    }
    catch (err) {
        console.error(`Error deleting file: ${err.message}`);
    }
});
exports.deleteFile = deleteFile;
const uploadImgToCloudinary = (name, filePath, folder) => __awaiter(void 0, void 0, void 0, function* () {
    cloudinary_1.v2.config({
        cloud_name: configs_1.configs.cloudinary.cloud_name,
        api_key: configs_1.configs.cloudinary.cloud_api_key,
        api_secret: configs_1.configs.cloudinary.cloud_api_secret,
    });
    try {
        const uploadResult = yield cloudinary_1.v2.uploader.upload(filePath, {
            folder,
            public_id: name,
            timeout: 60000,
        });
        return uploadResult;
    }
    catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Image upload failed");
    }
    finally {
        yield (0, exports.deleteFile)(filePath); // Always clean up
    }
});
exports.uploadImgToCloudinary = uploadImgToCloudinary;
const uploadMultipleImages = (filePaths, folder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageUrls = [];
        for (const filePath of filePaths) {
            const imageName = `${Math.floor(100 + Math.random() * 900)}-${Date.now()}`;
            const uploadResult = yield (0, exports.uploadImgToCloudinary)(imageName, filePath, folder);
            imageUrls.push(uploadResult.secure_url);
        }
        return imageUrls;
    }
    catch (error) {
        console.error("Error uploading multiple images:", error);
        throw new Error("Multiple image upload failed");
    }
});
exports.uploadMultipleImages = uploadMultipleImages;
const deleteImageFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    cloudinary_1.v2.config({
        cloud_name: configs_1.configs.cloudinary.cloud_name,
        api_key: configs_1.configs.cloudinary.cloud_api_key,
        api_secret: configs_1.configs.cloudinary.cloud_api_secret,
    });
    try {
        const result = yield cloudinary_1.v2.uploader.destroy(publicId);
        return result;
    }
    catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw new Error("Image deletion failed");
    }
});
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
// -----------------------------
// 🗂️ Multer setup for local uploads
// -----------------------------
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), "uploads")); // temp folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({ storage }); // Single file or fields
// Single image upload (req.file)
exports.uploadSingle = exports.upload.single("image");
// Single image for BusinessLogo upload (req.file)
exports.uploadSingleforBusinessLogo = exports.upload.single("businessLogo");
// Multiple image upload (req.files)
exports.uploadMultiple = exports.upload.array("images", 30);
// Fields-based upload (req.files.photo1, req.files.photo2)
exports.MultiUpload = exports.upload.fields([
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 },
]);
