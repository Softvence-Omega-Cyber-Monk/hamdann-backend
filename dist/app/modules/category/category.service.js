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
exports.CategoryService = void 0;
const cloudinary_1 = require("../../utils/cloudinary");
const category_model_1 = require("./category.model");
exports.CategoryService = {
    createCategory(payload, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imageUrl = payload.image || "";
                console.log("Service received - payload:", payload, "filePath:", filePath);
                // If image file exists, upload to Cloudinary
                if (filePath) {
                    // Generate a unique name for the image
                    const imageName = `category-${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(7)}`;
                    const uploadResult = yield (0, cloudinary_1.uploadImgToCloudinary)(imageName, // Use generated name instead of category name
                    filePath, "categories");
                    imageUrl = uploadResult.secure_url;
                }
                // Validate that we have an image URL
                if (!imageUrl) {
                    throw new Error("Category image is required");
                }
                const category = new category_model_1.Category({
                    name: payload.name,
                    image: imageUrl,
                });
                return yield category.save();
            }
            catch (error) {
                console.error("Error in createCategory:", error);
                // Clean up file if upload failed
                if (filePath) {
                    yield (0, cloudinary_1.deleteFile)(filePath).catch((cleanupError) => console.error("File cleanup error:", cleanupError));
                }
                throw new Error(error.message || "Failed to create category");
            }
        });
    },
    // Get all categories
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield category_model_1.Category.find().sort({ createdAt: -1 });
        });
    },
    // Get single category by ID
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield category_model_1.Category.findById(id);
        });
    },
    // Update category
    updateCategory(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
        });
    },
    // Delete category
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield category_model_1.Category.findByIdAndDelete(id);
        });
    },
};
