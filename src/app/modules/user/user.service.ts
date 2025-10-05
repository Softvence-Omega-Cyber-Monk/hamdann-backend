import { User_Model } from "./user.schema";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { cleanRegex } from "zod/v4/core/util.cjs";

export const user_service = {
  createUser: async (userData: TUser) => {
    // Check if email already exists
    const existingUser = await User_Model.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email already exists. Please use a different email.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = new User_Model({
      ...userData,
      password: hashedPassword,
      confirmPassword: hashedPassword, // store same for now
    });

    return await user.save();
  },

  // Get single user by ID
  getUserById: async (id: string) => {
    const user = await User_Model.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  // Get all users
  getAllUsers: async () => {
    return await User_Model.find().sort({ createdAt: -1 }); // newest first
  },

  // Update user (only name, email, address, paymentMethod)
  updateUser: async (
    id: string,
    updateData: Partial<
      Pick<TUser, "name" | "email" | "address" | "paymentMethod">
    >
  ) => {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid user ID");

    // Check if the user exists
    const existingUser = await User_Model.findById(id);
    if (!existingUser) throw new Error("User not found");

    // If updating email, check if it's already used by another user
    if (updateData.email) {
      const emailExists = await User_Model.findOne({
        email: updateData.email,
        _id: { $ne: id }, // exclude the current user
      });
      if (emailExists) throw new Error("Email already in use by another user");
    }
    console.log("updateData:", updateData);
    // Update user and return updated document
    const updatedUser = await User_Model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) throw new Error("Failed to update user");

    return updatedUser;
  },

  delete_user: async (id: string | Types.ObjectId) => {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid user ID");

    // Set isDeleted: true
    const user = await User_Model.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true } // return the updated document
    );

    if (!user) throw new Error("User not found");

    return user;
  },
};

export const user_services = {
  user_service,
};
