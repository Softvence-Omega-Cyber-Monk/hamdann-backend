import { Request, Response } from "express";

import {
  CreateProductSchema,
  UpdateProductSchema,
} from "./products.validation";
import { productService } from "./products.service";

export const createProduct = async (req: Request, res: Response) => {
  try {
    // console.log("Uploaded file(s):", req.file || req.files);

    const singleFile = req.file as Express.Multer.File;
    const multipleFiles = req.files as Express.Multer.File[];

    const product = await productService.createProductService(
      req.body,
      singleFile || multipleFiles // Pass whichever exists
    );


    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProductService(id, req.body);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProductsService();
    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getSingleProductService(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getProductByCategoryService = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const product = await productService.getProductByCategoryService(category);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getNewArrivalsProductsService = async (req: Request, res: Response) => {
  try {
    const product = await productService.getNewArrivalsProductsService();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getBestSellingProductsService = async (req: Request, res: Response) => {
  try {
    const product = await productService.getBestSellingProductsService();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getWishlistedProductsService = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { isWishlisted } = req.body;
    const product = await productService.getWishlistedProductsService(
      productId,
      isWishlisted
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const removeProductsWishlist = async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;
    console.log("Received product IDs:", productIds);
    const product = await productService.removeProductsWishlist(productIds);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductStats = async (req: Request, res: Response) => {
  try {
    const stats = await productService.getProductStatsService();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const addReviewToProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { rating, comment ,userId} = req.body;

    // Basic validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const updatedProduct = await productService.addProductReviewService(productId, { rating, comment ,userId });

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const productController = {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  getProductByCategoryService,
  getNewArrivalsProductsService,
  getBestSellingProductsService,
  getWishlistedProductsService,
  removeProductsWishlist,
  getProductStats,
  addReviewToProduct
};
