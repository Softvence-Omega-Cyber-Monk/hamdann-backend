import { User_Model } from "./user.schema";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { cleanRegex } from "zod/v4/core/util.cjs";
import { uploadImgToCloudinary } from "../../utils/cloudinary";
import { email } from "zod";

export const user_service = {
  createUser: async (
    userData: TUser & { businessLogoFile?: Express.Multer.File }
  ) => {
    console.log("user data ", userData);

    // Check if email already exists
    const existingUser = await User_Model.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email already exists. Please use a different email.");
    }

    // Handle business logo upload if file exists
    if (userData.businessLogoFile) {
      try {
        // Generate unique filename
        const filename = `business-logo-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}`;

        // Upload business logo to Cloudinary
        const uploadResult = await uploadImgToCloudinary(
          filename,
          userData.businessLogoFile.path,
          "business-logos"
        );

        // Add the Cloudinary URL to userData
        userData.businessLogo = uploadResult.secure_url;

        // Remove the file property as we don't want to save it in the database
        delete userData.businessLogoFile;
      } catch (error) {
        console.error("Error uploading business logo:", error);
        throw new Error("Failed to upload business logo");
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = new User_Model({
      ...userData,
      password: hashedPassword,
      confirmPassword: hashedPassword,
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
  googleAuthLogin: async (data: { name: string; email: string }) => {
    const isExitUser = await User_Model.findOne({email: email})
    console.log('exit ', isExitUser)
  },

  // Get all users
  getAllUsers: async () => {
    return await User_Model.find().sort({ createdAt: -1 }); // newest first
  },
  myProfile: async (userId: string) => {
    return await User_Model.findOne({ _id: userId });
  },

  // Update user
  updateUser: async (
    id: string,
    updateData: Partial<
      Pick<
        TUser,
        | "name"
        | "email"
        | "address"
        | "paymentMethods"
        | "profileImage"
        | "businessLogo"
      >
    > & {
      profileImageFile?: Express.Multer.File;
      businessLogoFile?: Express.Multer.File;
    }
  ) => {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid user ID");

    // Check if the user exists
    const existingUser = await User_Model.findById(id);
    if (!existingUser) throw new Error("User not found");

    // Handle image upload if file exists
    if (updateData.profileImageFile) {
      try {
        // Upload image to Cloudinary
        const uploadResult = await uploadImgToCloudinary(
          `user-${id}-${Date.now()}`,
          updateData.profileImageFile.path,
          "user-profiles"
        );

        // Add the Cloudinary URL to updateData
        updateData.profileImage = uploadResult.secure_url;

        // Remove the file property as we don't want to save it in the database
        delete updateData.profileImageFile;
      } catch (error) {
        throw new Error("Failed to upload profile image");
      }
    }
    // Handle business logo upload if file exists
    if (updateData.businessLogoFile) {
      try {
        // Upload business logo to Cloudinary
        const uploadResult = await uploadImgToCloudinary(
          `business-logo-${id}-${Date.now()}`,
          updateData.businessLogoFile.path,
          "business-logos"
        );

        // Add the Cloudinary URL to updateData
        updateData.businessLogo = uploadResult.secure_url;

        // Remove the file property as we don't want to save it in the database
        delete updateData.businessLogoFile;
      } catch (error) {
        throw new Error("Failed to upload business logo");
      }
    }

    // Update user in database
    const updatedUser = await User_Model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password from response

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
  updateFcmToken: async (userId: string, fcmToken: string) => {
    const updatedUser = await User_Model.findByIdAndUpdate(
      userId,
      { fcmToken },
      { new: true }
    );

    if (!updatedUser) throw new Error("User not found");

    return updatedUser;
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
