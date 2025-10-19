import { Request, Response } from "express";
import { CategoryService } from "./category.service";

export const CategoryController = {
  // Create
  async create(req: Request, res: Response) {
    try {
      const file = req.file;

      // 🧹 Sanitize body keys (remove spaces)
      const sanitizedBody: any = {};
      Object.keys(req.body).forEach((key) => {
        sanitizedBody[key.trim()] = req.body[key];
      });

      const { name } = sanitizedBody;

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Category name is required" });
      }

      // Construct image path
      const imagePath = file
        ? `/uploads/${file.filename}`
        : sanitizedBody.img || "";

      const categoryData : any = { name, image: imagePath };

      console.log('cate', categoryData)
  

      const category = await CategoryService.createCategory(req.body,imagePath);

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Get all
  async getAll(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({
        success: true,
        message: "Category get all successfull",
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get single
  async getById(req: Request, res: Response) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (!category)
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      res.status(200).json({
        success: true,
        message: "Single Category get successfull",
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update
  async update(req: Request, res: Response) {
    try {
      const category = await CategoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!category)
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      res.status(200).json({
        success: true,
        message: "Category update successfull",
        data: category,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Delete
  async delete(req: Request, res: Response) {
    try {
      const deleted = await CategoryService.deleteCategory(req.params.id);
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
