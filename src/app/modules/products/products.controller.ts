import { Request, Response } from "express";

import {
  CreateProductSchema,
  UpdateProductSchema,
} from "./products.validation";
import { productService } from "./products.service";



const createProduct = async (req: Request, res: Response) => {
  try {


    


  

  


  
    const product = await productService.createProductService(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProductService(
      id,
      req.body
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
    const {productIds } = req.body;
    console.log('Received product IDs:', productIds);
    const product = await productService.removeProductsWishlist(
     
      productIds
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

const getProductStats = async (req: Request, res: Response) => {
  try {
    const stats = await productService.getProductStatsService();
    
    res.status(200).json({ 
      success: true, 
      data: stats 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
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
};
