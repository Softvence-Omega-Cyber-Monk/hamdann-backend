import { Product } from "./products.model";
import { IProduct } from "./products.interface";

const createProductService = async (payload: IProduct) => {
  // console.log('product payload in service ', payload);
  const product = await Product.create(payload);
  return product;
};

const updateProductService = async (id: string, payload: Partial<IProduct>) => {
    // console.log('update payload in service ', payload);
  const product = await Product.findByIdAndUpdate(id, payload, { new: true });
  return product;
};

const getAllProductsService = async () => {
  const products = await Product.find();
  return products;
};

const getSingleProductService = async (id: string) => {
  const product = await Product.findById(id);
  return product;
};
const getProductByCategoryService = async (category: string) => {
  const product = await Product.find({category: category});
  return product;
};

export const productService = {
  createProductService,
  updateProductService,
  getAllProductsService,
  getSingleProductService,
  getProductByCategoryService
};
