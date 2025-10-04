// Create user schema (already exists)
import { z } from "zod";

export const create_user = z
  .object({
    role: z.enum(["Admin", "Buyer", "Saler"]),
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
    address: z
      .object({
        state: z.string().optional(),
        city: z.string().optional(),
        zip: z.string().optional(),
        streetAddress: z.string().optional(),
      })
      .optional(),
    paymentMethod: z
      .object({
        method: z.string().optional(),
        cardNumber: z.string().optional(),
        expiryDate: z.string().optional(),
        cvv: z.number().optional(),
      })
      .optional(),
    businessInfo: z
      .object({
        businessName: z.string().optional(),
        businessType: z.string().optional(),
        businessDescription: z.string().optional(),
        country: z.string().optional(),
        phoneNumber: z.string().optional(),
        businessLogo: z.string().optional(),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ✅ Update user schema
export const update_user = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  address: z
    .object({
      state: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
      streetAddress: z.string().optional(),
    })
    .optional(),
  paymentMethod: z
    .object({
      method: z.string().optional(),
      cardNumber: z.string().optional(),
      expiryDate: z.coerce.date().optional(),
      cvv: z.number().optional(),
    })
    .optional(),
});