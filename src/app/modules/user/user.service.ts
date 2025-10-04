// import { Request } from "express"
// import uploadCloud from "../../utils/cloudinary";
// import { User_Model } from "./user.schema";
// import { Account_Model } from "../auth/auth.schema";

// const update_profile_into_db = async (req: Request) => {
//     // upload file and get link
//     if (req.file) {
//         const uploadedImage = await uploadCloud(req.file);
//         req.body.photo = uploadedImage?.secure_url;
//     };

//     const isExistUser = await Account_Model.findOne({ email: req?.user?.email }).lean()
//     const result = await User_Model.findOneAndUpdate({ accountId: isExistUser!._id }, req?.body)
//     return result
// }



// export const user_services = {
//     update_profile_into_db
// }

import { User_Model } from "./user.schema";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { cleanRegex } from "zod/v4/core/util.cjs";

export const user_service = {
  createUser: async (userData: TUser) => {
    // hash password
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
    updateData: Partial<Pick<TUser, "name" | "email" | "address" | "paymentMethod">>
  ) => {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid user ID");

    const updatedUser = await User_Model.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) throw new Error("User not found");

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
    user_service
}
