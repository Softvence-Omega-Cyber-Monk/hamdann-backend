import { z } from "zod";

export const ProductVariationSchema = z.object({
  image: z.string().url().optional(), // must be a valid URL if provided
  color: z.string().optional(),
  size: z.string().optional(),
});

export const ProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  sku: z.string().min(1, "SKU is required"),
  category: z.enum(["Fashion", "Food", "Beauty", "Perfume"]),
  brand: z.string().optional(),
  weight: z.number().optional(),
  gender: z.enum(["male", "female"]).default("male"),
  availableSizes: z.array(z.string()).optional(),
  availableColors: z.array(z.string()).optional(),
  variations: z.array(ProductVariationSchema).optional(),
  description: z.string().min(5, "Description must be at least 5 characters"),
  quantity: z.number().min(0, "Quantity must be 0 or more").default(0),
  price: z.number().positive("Price must be greater than 0"),
  productImages: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "At least one image is required"),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
});

// ✅ Schema for creating a product
export const CreateProductSchema = ProductSchema;

// ✅ Schema for updating a product (all fields optional except _id in route param)
export const UpdateProductSchema = ProductSchema.partial();
