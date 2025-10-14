import { Product } from "./products.model";
import { IProduct } from "./products.interface";
import { Order } from "../order/order.model";
import {
  uploadImgToCloudinary,
  uploadMultipleImages,
} from "../../utils/cloudinary";
import { User_Model } from "../user/user.schema";
import mongoose from "mongoose";
import { sendNotification } from "../../utils/notificationHelper";

interface ReviewInput {
  rating: number;
  comment?: string;
}

const shopReview = async (userId: any) => {
  const reviews = await Product.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $unwind: "$reviews" },
    {
      $group: {
        _id: "$userId",
        averageRating: { $avg: "$reviews.rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);
  return reviews;
};
interface ProductQueryOptions {
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const createProductService = async (
  payload: IProduct,
  imageInput: Express.Multer.File | Express.Multer.File[]
) => {
  const { userId } = payload;

  const exitUser = await User_Model.findById({ _id: userId });
  if (!exitUser) {
    throw new Error("User not found");
  }

  if (exitUser.role !== "Seller") {
    throw new Error("Only sellers can add products");
  }

  const shopReviews = await shopReview(userId);
  console.log("shopReviews ", shopReviews);

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
    shopName: exitUser.businessInfo?.businessName || null,
    shopReviews: shopReviews[0]?.averageRating,
    productImages: imageUrls,
  };

  const product = await Product.create(productPayload);

  // Notify all customers
  // const customers = await User_Model.find({ role: "Buyer" });
  // for (const user of customers) {
  //   await sendNotification(
  //     user._id.toString(),
  //     "🛒 New Product Added!",
  //     `${product.name} is now available!`
  //   );
  // }

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
const getSingleUserProductService = async (userId: string) => {
  const product = await Product.find({ userId: userId });
  return product;
};

const getProductByCategoryService = async (
  category: string,
  options: ProductQueryOptions = {}
) => {
  const { sort, search, page = 1, limit = 10 } = options;

  const filter: Record<string, any> = { category };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  let sortQuery: Record<string, 1 | -1> = {};

  if (sort) {
    const sortOptions = sort.split(",").map((s) => s.trim());

    sortOptions.forEach((option) => {
      if (option === "low-to-high") {
        sortQuery.price = 1;
      } else if (option === "high-to-low") {
        sortQuery.price = -1;
      } else if (option === "best-selling") {
        sortQuery.salesCount = -1;
      }
    });
  }

  // Pagination
  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .exec();

  const totalCategoryProduct = await Product.countDocuments(filter);

  return {
    products,
    totalCategoryProduct,
    page,
    pages: Math.ceil(totalCategoryProduct / limit),
  };
};

const getNewArrivalsProductsService = async () => {
  const newArrivals = await Product.find({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Filter for the last 30 days
  }).sort({ createdAt: -1 });

  return newArrivals;
};
const getBestSellingProductsService = async () => {
  const bestSellingProducts = await Product.find().sort({ salesCount: -1 }); // Sort by salesCount in descending order (highest first)

  console.log("bestSellingProducts ", bestSellingProducts.length);

  return bestSellingProducts;
};
const getSellerBestSellingProductsService = async (userId: string) => {
  console.log("userId in service ", userId);
  const bestSellingProducts = await Product.find({ userId: userId }).sort({
    salesCount: -1,
  }); // Sort by salesCount in descending order (highest first)

  console.log("bestSellingProducts ", bestSellingProducts.length);

  return bestSellingProducts;
};

const getWishlistedProductsService = async (userId: string) => {
  console.log("userid -------------0000 ", userId);
  const wishListedProducts = await Product.find({
    isWishlisted: true,
    userId: userId,
  });

  console.log("wishListedProducts ", wishListedProducts.length);

  return wishListedProducts;
};
const updateWishlistedProductsService = async (
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

const getProductStatsService = async (userId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const totalProducts = await Product.countDocuments({ userId: userObjectId });

  const variationsResult = await Product.aggregate([
    { $match: { userId: userObjectId } },
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

  const unitsResult = await Product.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: null,
        totalUnits: { $sum: "$quantity" },
      },
    },
  ]);
  const totalUnits = unitsResult[0]?.totalUnits || 0;

  const activeProducts = await Product.countDocuments({
    userId: userObjectId,
    quantity: { $gt: 0 },
  });

  const outOfStock = await Product.countDocuments({
    userId: userObjectId,
    quantity: 0,
  });
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
  console.log("dkfsdlf", userId, review);
  const existingUser = await User_Model.findById({ _id: userId });

  const product = (await Product.findById(productId)) as any;

  if (!product) {
    throw new Error("Product not found");
  }

  const reviewData = {
    ...review,
    userId: existingUser?.name,
  };

  console.log("reaq ", reviewData);
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

  // ✅ Recalculate shop’s (seller’s) overall rating across all products
  const shopId = product.userId; // seller's ID
  const shopStats = await Product.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(shopId),
        "reviews.rating": { $exists: true, $ne: null },
      },
    },
    { $unwind: "$reviews" },
    {
      $group: {
        _id: "$userId",
        averageRating: { $avg: "$reviews.rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const shopAverageRating = shopStats[0]?.averageRating || 0;
  const totalShopReviews = shopStats[0]?.totalReviews || 0;

  // ✅ Update all products of that seller with the latest shop average rating
  const res = await Product.updateMany(
    { userId: shopId },
    {
      $set: {
        shopReviews: shopAverageRating,
      },
    }
  );

  console.log("Updated products with new shop rating:", res);

  return product;
};

const getInventoryStatusService = async (userId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const inventoryStatus = await Product.find(
    { userId: userObjectId },
    { name: 1, quantity: 1, _id: 0 } // Only return name and quantity fields
  ).sort({ name: 1 }); // Sort by product name alphabetically

  return inventoryStatus;
};

interface InventoryStatus {
  availableStock: number;
  stockStatus: "In Stock" | "Out of Stock" | "Low Stock";
  lowStockThreshold: number;
  lastRestock?: string;
  // needsRestock: boolean;
}

// Get inventory status for a specific product
const getInventoryStatusForSingleProduct = async (
  productId: string
): Promise<InventoryStatus> => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Calculate stock status based on quantity and threshold
  const calculateStockStatus = (
    quantity: number,
    lowStockThreshold: number
  ): "In Stock" | "Out of Stock" | "Low Stock" => {
    if (quantity === 0) {
      return "Out of Stock";
    } else if (quantity <= lowStockThreshold) {
      return "Low Stock";
    } else {
      return "In Stock";
    }
  };

  const lowStockThreshold = 50;
  const stockStatus = calculateStockStatus(product.quantity, lowStockThreshold);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  const lastRestock = product.updatedAt
    ? formatDate(product.updatedAt)
    : undefined;

  return {
    availableStock: product.quantity,
    stockStatus,
    lowStockThreshold,
    lastRestock,
    // needsRestock: product.quantity <= lowStockThreshold,
  };
};

// Update product quantity
const updateProductQuantity = async (
  productId: string, 
  newQuantity: number
): Promise<{ success: boolean; quantity: number }> => {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new Error("Product not found");
  }

  if (newQuantity < 0) {
    throw new Error("Quantity cannot be negative");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { 
      quantity: newQuantity,
      $inc: { salesCount: newQuantity < product.quantity ? product.quantity - newQuantity : 0 }
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new Error("Failed to update product quantity");
  }

  return {
    success: true,
    quantity: updatedProduct.quantity
  };
};

// Get single product statistic
interface ProductStats {
  totalSales: number;
  revenue: number;
  totalOrders: number;
  deliveredOrders: number;
  conversionRate: number;
}
const getSingleProductStats = async (productId: string): Promise<ProductStats> => {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new Error("Product not found");
  }
  const orders = await Order.find({
    "items.productId": productId
  });

 
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(order => order.status === "delivered").length;
 
  const conversionRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

  let totalSales = 0;
  let revenue = 0;

  orders.forEach(order => {
    if (order.status === "delivered") {
      const productItem = order.items.find(item => 
        item.productId.toString() === productId.toString()
      );
      if (productItem) {
        totalSales += productItem.quantity;
        revenue += productItem.quantity * productItem.price;
      }
    }
  });
  const growthPercentage = 12;

  return {
    totalSales,
    revenue,
    totalOrders,
    deliveredOrders,
    conversionRate: Number(conversionRate.toFixed(2)),
  };
};



export const productService = {
  createProductService,
  updateProductService,
  getAllProductsService,
  getSingleProductService,
  getSingleUserProductService,
  getProductByCategoryService,
  getNewArrivalsProductsService,
  getBestSellingProductsService,
  getSellerBestSellingProductsService,
  getWishlistedProductsService,
  updateWishlistedProductsService,
  removeProductsWishlist,
  getProductStatsService,
  addProductReviewService,
  getInventoryStatusService,
  getInventoryStatusForSingleProduct,
  updateProductQuantity,
  getSingleProductStats,
};
