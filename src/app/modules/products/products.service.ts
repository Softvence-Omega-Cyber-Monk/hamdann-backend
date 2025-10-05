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
  const product = await Product.find({ category: category });
  return product;
};
const getNewArrivalsProductsService = async () => {
  const newArrivals = await Product.find({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Filter for the last 30 days
  }).sort({ createdAt: -1 }); // Sort by creation date in descending order (most recent first)

  return newArrivals;
};
const getBestSellingProductsService = async () => {
  const bestSellingProducts = await Product.find()
    .sort({ salesCount: -1 }) // Sort by salesCount in descending order (highest first)
    .limit(10); // Limit the result to top 10 best sellers (you can adjust the number as needed)

  return bestSellingProducts;
};
const getWishlistedProductsService = async (
  productId: string,
  isWishlisted: boolean
) => {
  const wishListedProducts = await Product.findOneAndUpdate(
    { _id: productId },
    { isWishlisted: isWishlisted },
    { new: true }
  ); // Return the updated document
  return wishListedProducts;
};

export const productService = {
  createProductService,
  updateProductService,
  getAllProductsService,
  getSingleProductService,
  getProductByCategoryService,
  getNewArrivalsProductsService,
  getBestSellingProductsService,
  getWishlistedProductsService,
};
