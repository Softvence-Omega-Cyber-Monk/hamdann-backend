"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductSchema = exports.ProductVariationSchema = void 0;
const zod_1 = require("zod");
exports.ProductVariationSchema = zod_1.z.object({
    image: zod_1.z.string().url().optional(), // must be a valid URL if provided
    color: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
});
exports.ProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Product name must be at least 2 characters"),
    sku: zod_1.z.string().min(1, "SKU is required"),
    category: zod_1.z.enum(["Fashion", "Food", "Beauty", "Perfume"]),
    brand: zod_1.z.string().optional(),
    weight: zod_1.z.number().optional(),
    gender: zod_1.z.enum(["male", "female"]).default("male"),
    availableSizes: zod_1.z.array(zod_1.z.string()).optional(),
    availableColors: zod_1.z.array(zod_1.z.string()).optional(),
    variations: zod_1.z.array(exports.ProductVariationSchema).optional(),
    description: zod_1.z.string().min(5, "Description must be at least 5 characters"),
    quantity: zod_1.z.number().min(0, "Quantity must be 0 or more").default(0),
    price: zod_1.z.number().positive("Price must be greater than 0"),
    productImages: zod_1.z
        .array(zod_1.z.string().url("Must be a valid URL"))
        .min(1, "At least one image is required"),
    salesCount: zod_1.z.number().min(0).default(0),
    isNewArrival: zod_1.z.boolean().default(false),
    isWishlisted: zod_1.z.boolean().default(false),
});
// ✅ Schema for creating a product
exports.CreateProductSchema = exports.ProductSchema;
// ✅ Schema for updating a product (all fields optional except _id in route param)
exports.UpdateProductSchema = exports.ProductSchema.partial();
