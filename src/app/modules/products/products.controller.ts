import { Request, Response } from "express";

import {
  CreateProductSchema,
  UpdateProductSchema,
} from "./products.validation";
import { productService } from "./products.service";

 const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateProductSchema.parse(req.body);
    const product = await productService.createProductService(validatedData);
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

 const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateProductSchema.parse(req.body);
    const product = await productService.updateProductService(
      id,
      validatedData
    );

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
    const {isWishlisted} = req.body;
    const product = await productService.getWishlistedProductsService(productId ,isWishlisted);

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

export const productController = {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  getProductByCategoryService, 
  getNewArrivalsProductsService,
  getBestSellingProductsService,
  getWishlistedProductsService
};
