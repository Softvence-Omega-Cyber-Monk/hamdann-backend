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
exports.CategoryController = void 0;
const category_service_1 = require("./category.service");
exports.CategoryController = {
    // Create
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const file = req.file;
                console.log("file ", file);
                // console.log("Uploaded file:", file);
                // Pass the actual file path to the service
                const filePath = file ? file.path : undefined;
                const category = yield category_service_1.CategoryService.createCategory({ name }, filePath);
                res.status(201).json({
                    success: true,
                    message: "Category created successfully",
                    data: category,
                });
            }
            catch (error) {
                console.error(error);
                res.status(400).json({ success: false, message: error.message });
            }
        });
    },
    // Get all
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield category_service_1.CategoryService.getAllCategories();
                res.status(200).json({
                    success: true,
                    message: "Category get all successfull",
                    data: categories,
                });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    },
    // Get single
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield category_service_1.CategoryService.getCategoryById(req.params.id);
                if (!category)
                    return res
                        .status(404)
                        .json({ success: false, message: "Category not found" });
                res.status(200).json({
                    success: true,
                    message: "Single Category get successfull",
                    data: category,
                });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    },
    // Update
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req === null || req === void 0 ? void 0 : req.body;
            const file = req.file;
            // console.log("in controller ", file);
            // console.log("Uploaded file:", file);
            // Pass the actual file path to the service
            const filePath = file ? file.path : undefined;
            try {
                const category = yield category_service_1.CategoryService.updateCategory(req.params.id, data.name, filePath);
                // if (!category)
                //   return res
                //     .status(404)
                //     .json({ success: false, message: "Category not found" });
                res.status(200).json({
                    success: true,
                    message: "Category update successfull",
                    data: category,
                });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
        });
    },
    // Delete
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield category_service_1.CategoryService.deleteCategory(req.params.id);
                if (!deleted)
                    return res
                        .status(404)
                        .json({ success: false, message: "Category not found" });
                res.status(200).json({ success: true, message: "Category deleted" });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    },
};
