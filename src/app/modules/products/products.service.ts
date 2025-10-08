import { Product } from "./products.model";
import { IProduct } from "./products.interface";
import {
  uploadImgToCloudinary,
  uploadMultipleImages,
} from "../../utils/cloudinary";
import { User_Model } from "../user/user.schema";

interface ReviewInput {
  rating: number;
  comment?: string;
}

export const createProductService = async (
  payload: IProduct,
  imageInput: Express.Multer.File | Express.Multer.File[]
) => {
  let imageUrls: string[] = [];

  if (Array.isArray(imageInput)) {
    // Multiple images
    const filePaths = imageInput.map((file) => file.path);
    imageUrls = await uploadMultipleImages(filePaths, "Products");
  } else if (imageInput) {
    // Single image
    const result = await uploadImgToCloudinary(
      imageInput.filename,
      imageInput.path,
      "Products"
    );
    imageUrls = [result.secure_url];
  }

  const productPayload = {
    ...payload,
    productImages: imageUrls,
  };

  const product = await Product.create(productPayload);
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
  }).sort({ createdAt: -1 });

  return newArrivals;
};
const getBestSellingProductsService = async () => {
  const bestSellingProducts = await Product.find()
    .sort({ salesCount: -1 }) // Sort by salesCount in descending order (highest first)
    .limit(10);

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

const removeProductsWishlist = async (productIds: string[]) => {
  // Set `isWishlisted` to false for multiple products
  console.log("Product IDs to update:", productIds);
  const result = await Product.updateMany(
    { _id: { $in: productIds } },
    { $set: { isWishlisted: false } }
  );

  console.log("Update result:", result);
  // Return updated products
  const updatedProducts = await Product.find({ _id: { $in: productIds } });
  return updatedProducts;
  // Product statistics
};

const getProductStatsService = async () => {
  // Total Products count
  const totalProducts = await Product.countDocuments();

  // Total Variations - sum of variations array lengths across all products
  const variationsResult = await Product.aggregate([
    {
      $project: {
        variationsCount: { $size: { $ifNull: ["$variations", []] } },
      },
    },
    {
      $group: {
        _id: null,
        totalVariations: { $sum: "$variationsCount" },
      },
    },
  ]);
  const totalVariations = variationsResult[0]?.totalVariations || 0;

  // Total Units - sum of quantity across all products
  const unitsResult = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalUnits: { $sum: "$quantity" },
      },
    },
  ]);
  const totalUnits = unitsResult[0]?.totalUnits || 0;

  // Active Products (quantity > 0)
  const activeProducts = await Product.countDocuments({ quantity: { $gt: 0 } });

  // Out of Stock Products (quantity = 0)
  const outOfStock = await Product.countDocuments({ quantity: 0 });

  return {
    totalProducts,
    totalVariations,
    // totalUnits,
    activeProducts,
    outOfStock,
  };
};

export const addProductReviewService = async (
  productId: string,
  userId: string,
  review: ReviewInput
) => {

  console.log('dkfsdlf', userId, review)
  const existingUser = await User_Model.findById({ _id: userId });


  const product = (await Product.findById(productId)) as any;

  if (!product) {
    throw new Error("Product not found");
  }

  const reviewData = {
    ...review,
    userId : existingUser?.name
  }

  console.log('reaq ', reviewData)
  // Add the new review
  product.reviews.push(reviewData);

  // Update average rating
  const totalReviews = product.reviews.length;
  const totalRating = product.reviews.reduce(
    (sum: any, r: { rating: any }) => sum + (r.rating || 0),
    0
  );
  product.averageRating = totalRating / totalReviews;

  await product.save();

  return product;
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
  removeProductsWishlist,
  getProductStatsService,
  addProductReviewService,
};
