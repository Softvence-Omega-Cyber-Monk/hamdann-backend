import { User_Model } from "./user.schema";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { cleanRegex } from "zod/v4/core/util.cjs";
import {
  uploadImgToCloudinary,
} from "../../utils/cloudinary";

export const user_service = {
  createUser: async (userData: TUser) => {
    console.log('user data ', userData)
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
  myProfile: async (userId: string) => {
    return await User_Model.findOne({ _id: userId });
  },

  // Update user (only name, email, address, paymentMethod)
  updateUser: async (
    id: string,
    updateData: Partial<
      Pick<TUser, "name" | "email" | "address" | "paymentMethods" | "profileImage">
    > & { file?: Express.Multer.File }
  ) => {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid user ID");

    // Check if the user exists
    const existingUser = await User_Model.findById(id);
    if (!existingUser) throw new Error("User not found");

    // // If updating email, check if it's already used by another user
    // if (updateData.email) {
    //   const emailExists = await User_Model.findOne({
    //     email: updateData.email,
    //     _id: { $ne: id }, // exclude the current user
    //   });
    //   if (emailExists) throw new Error("Email already in use by another user");
    // }

     // Handle image upload if file exists
    if (updateData.file) {
      try {
        // Upload image to Cloudinary
        const uploadResult = await uploadImgToCloudinary(
          `user-${id}-${Date.now()}`,
          updateData.file.path,
          "user-profiles"
        );
        
        // Add the Cloudinary URL to updateData
        updateData.profileImage = uploadResult.secure_url;
        
        // Remove the file property as we don't want to save it in the database
        delete updateData.file;
        
      } catch (error) {
        throw new Error("Failed to upload profile image");
      }
    }

    

    console.log("updateData:", updateData);
    // Update user and return updated document
    const updatedUser = await User_Model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) throw new Error("Failed to update user");
    console.log("Update user data", updatedUser);

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

// 🟢 Add new payment method
const addPaymentMethodService = async (userId: string, paymentData: any) => {
  const user = await User_Model.findById(userId);
  if (!user) throw new Error("User not found");
  user.paymentMethods = user.paymentMethods || [];
  user.paymentMethods.push(paymentData);
  await user.save();
  await user.save();
  return user;
};

// 🟡 Update specific payment method
const updatePaymentMethodService = async (
  userId: string,
  paymentId: string,
  updateData: any
) => {
  const updatedUser = await User_Model.findOneAndUpdate(
    { _id: userId, "paymentMethods._id": paymentId },
    {
      $set: {
        "paymentMethods.$.method": updateData.method,
        "paymentMethods.$.cardNumber": updateData.cardNumber,
        "paymentMethods.$.expiryDate": updateData.expiryDate,
        "paymentMethods.$.cvv": updateData.cvv,
      },
    },
    { new: true }
  );

  if (!updatedUser) throw new Error("Payment method not found");
  return updatedUser;
};

// 🟠 Set one payment method as default
const setDefaultPaymentMethodService = async (
  userId: string,
  paymentId: string
) => {
  // Step 1: unset all defaults
  await User_Model.updateOne(
    { _id: userId },
    { $set: { "paymentMethods.$[].isDefault": false } }
  );

  // Step 2: set selected as default
  const updatedUser = await User_Model.findOneAndUpdate(
    { _id: userId, "paymentMethods._id": paymentId },
    { $set: { "paymentMethods.$.isDefault": true } },
    { new: true }
  );

  if (!updatedUser) throw new Error("Payment method not found");
  return updatedUser;
};

// 🔴 Delete a payment method
const deletePaymentMethodService = async (
  userId: string,
  paymentId: string
) => {
  const updatedUser = await User_Model.findByIdAndUpdate(
    userId,
    { $pull: { paymentMethods: { _id: paymentId } } },
    { new: true }
  );

  if (!updatedUser) throw new Error("Payment method not found");
  return updatedUser;
};

export const user_services = {
  user_service,
  addPaymentMethodService,
  updatePaymentMethodService,
  setDefaultPaymentMethodService,
  deletePaymentMethodService,
};
