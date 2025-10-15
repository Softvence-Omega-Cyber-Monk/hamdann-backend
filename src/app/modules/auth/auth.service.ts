import { AppError } from "../../utils/app_error";
import { TAccount, TLoginPayload, TRegisterPayload } from "./auth.interface";
import { Account_Model } from "./auth.schema";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { TUser } from "../user/user.interface";
import { User_Model } from "../user/user.schema";
import mongoose from "mongoose";
import { jwtHelpers } from "../../utils/JWT";
import { configs } from "../../configs";
import { JwtPayload, Secret } from "jsonwebtoken";
import sendMail from "../../utils/mail_sender";
import { isAccountExist } from "../../utils/isAccountExist";

// login user

const login_user_from_db = async (payload: TLoginPayload) => {
  // Find user by email and not deleted
  const user = await User_Model.findOne({
    email: payload.email,
    isDeleted: false,
  });



  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  // Compare password
  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError("Invalid password", httpStatus.UNAUTHORIZED);
  }

  // Generate tokens
  const accessToken = jwtHelpers.generateToken(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    configs.jwt.accessToken_secret as Secret,
    configs.jwt.accessToken_expires as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    configs.jwt.refreshToken_secret as Secret,
    configs.jwt.refreshToken_expires as string
  );


  console.log(' User role from service ',user.role, user._id)
  return {
    accessToken,
    refreshToken,
    role: user.role,
    userId: user._id,
    isPaidPlan: user.isPaidPlan || false,
    subscribtionPlan: user.subscribtionPlan || null,
  };
};

const refresh_token_from_db = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      configs.jwt.refreshToken_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await Account_Model.findOne({
    email: decodedData.email,
    status: "ACTIVE",
    isDeleted: false,
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    configs.jwt.accessToken_secret as Secret,
    configs.jwt.accessToken_expires as string
  );

  return accessToken;
};

const change_password_from_db = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {

  const isExistAccount = await isAccountExist(user?.email);


  if (!isExistAccount) {
    throw new AppError("Account not found", httpStatus.NOT_FOUND);
  }

  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    isExistAccount.password
  );

  // console.log("match pass",isCorrectPassword);

  if (!isCorrectPassword) {
    throw new AppError("Old password is incorrect", httpStatus.UNAUTHORIZED);
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

  await User_Model.findOneAndUpdate(
    { email: isExistAccount.email },
    {
      password: hashedPassword,
      updatedAt: new Date(),
    }
  );

  return "Password changed successful.";
};

const forget_password_from_db = async (email: string) => {
  const isAccountExists = await isAccountExist(email);
  const resetToken = jwtHelpers.generateToken(
    {
      email: isAccountExists.email,
      role: isAccountExists.role,
    },
    configs.jwt.resetToken_secret as Secret,
    configs.jwt.resetToken_expires as string
  );

  const resetPasswordLink = `${configs.jwt.front_end_url}/reset?token=${resetToken}&email=${isAccountExists.email}`;
  const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;

  await sendMail({
    to: email,
    subject: "Password reset successful!",
    textBody: "Your password is successfully reset.",
    htmlBody: emailTemplate,
  });

  return "Check your email for reset link";
};


export const auth_services = {
  login_user_from_db,
  refresh_token_from_db,
  change_password_from_db,
  forget_password_from_db,
};
