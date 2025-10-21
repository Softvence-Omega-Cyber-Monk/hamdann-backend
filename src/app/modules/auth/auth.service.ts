import { AppError } from "../../utils/app_error";
import { TAccount, TLoginPayload, TRegisterPayload } from "./auth.interface";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { User_Model } from "../user/user.schema";
import { jwtHelpers } from "../../utils/JWT";
import { configs } from "../../configs";
import { JwtPayload, Secret } from "jsonwebtoken";
import sendMail from "../../utils/mail_sender";
import { isAccountExist } from "../../utils/isAccountExist";
import { sendEmailForCode } from "../../utils/sendEmailForCode";
import { passwordResetModel } from "./auth.schema";

// login user
export const login_user_from_db = async (payload: TLoginPayload) => {
  console.log("device token:", payload.deviceToken);

  // 1️⃣ Find the user
  const user: any = await User_Model.findOne({
    email: payload.email,
    isDeleted: false,
  });

  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  // 2️⃣ Check password
  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError("Invalid password", httpStatus.UNAUTHORIZED);
  }

  // 3️⃣ Check device limit based on plan
  const singleDevicePlans = ["starter", "starterYearly"];
  const multiDevicePlans = ["advanced", "advancedYearly"];

  if (singleDevicePlans.includes(user?.subscribtionPlan)) {
    // Single-device restriction
    if (user.deviceToken && user.deviceToken !== payload.deviceToken) {
      throw new AppError(
        "Your account is already logged in on another device. Please logout from that device first.",
        httpStatus.FORBIDDEN
      );
    }

    // Save new deviceToken if not set yet
    if (!user.deviceToken) {
      user.deviceToken = payload.deviceToken;
      await user.save();
    }
  }

  // 4️⃣ For multi-device plans, optionally track devices (optional)
  if (multiDevicePlans.includes(user.subscribtionPlan)) {
    if (!user.deviceTokens) user.deviceTokens = [];
    // Store up to 5 recent devices
    if (!user.deviceTokens.includes(payload.deviceToken)) {
      user.deviceTokens.push(payload.deviceToken);
      if (user.deviceTokens.length > 5) user.deviceTokens.shift(); // keep last 5
      await user.save();
    }
  }

  // 5️⃣ Generate tokens
  const accessToken = jwtHelpers.generateToken(
    { userId: user._id, email: user.email, role: user.role },
    configs?.jwt.accessToken_secret as string,
    configs.jwt.accessToken_expires as string
  );

  const refreshToken = jwtHelpers.generateToken(
    { userId: user._id, email: user.email, role: user.role },
    configs.jwt.refreshToken_secret as string,
    configs.jwt.refreshToken_expires as string
  );

  // 6️⃣ Return response
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

  const userData: any = await User_Model.findOne({
    email: decodedData.email,
    isDeleted: false,
  });

  const accessToken = jwtHelpers.generateToken(
    { userId: userData?._id, email: userData?.email, role: userData?.role },
    configs?.jwt.accessToken_secret as string,
    configs.jwt.accessToken_expires as string
  );

  return { accessToken };
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

// const forget_password_from_db = async (email: string) => {
//   const isAccountExists = await isAccountExist(email);
//   const resetToken = jwtHelpers.generateToken(
//     {
//       email: isAccountExists.email,
//       role: isAccountExists.role,
//     },
//     configs.jwt.resetToken_secret as Secret,
//     configs.jwt.resetToken_expires as string
//   );

//   const resetPasswordLink = `${configs.jwt.front_end_url}/reset?token=${resetToken}&email=${isAccountExists.email}`;
//   const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;

//   await sendMail({
//     to: email,
//     subject: "Password reset successful!",
//     textBody: "Your password is successfully reset.",
//     htmlBody: emailTemplate,
//   });

//   return "Check your email for reset link";
// };

// const logoutRemoveToken = async (email: string) => {
//   const updatedUser = await User_Model.findOneAndUpdate(
//     { email },
//     { $unset: { deviceToken: "" } }, // 👈 removes the field entirely
//     { new: true } // returns updated document
//   );

//   return updatedUser;
// };
export const logoutRemoveToken = async (
  userId: string,
  deviceToken: string
) => {
  const user: any = await User_Model.findById(userId);
  if (!user) throw new AppError("User not found", httpStatus.NOT_FOUND);

  const singleDevicePlans = ["starter", "starterYearly"];
  const multiDevicePlans = ["advanced", "advancedYearly"];

  if (singleDevicePlans.includes(user?.subscribtionPlan)) {
    user.deviceToken = null;
  } else if (multiDevicePlans.includes(user.subscribtionPlan)) {
    user.deviceTokens = user.deviceTokens.filter(
      (token: any) => token !== deviceToken
    );
  }

  await user.save();
  return { message: "Logged out successfully" };
};

export const requestPasswordReset = async (email: string) => {
  const user = await User_Model.findOne({ email });
  if (!user) throw new Error("User not found");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Remove old code if exists
  await passwordResetModel.deleteMany({ email });

  // Store new code
  await passwordResetModel.create({ email, code, expiresAt });

  await sendEmailForCode({
    to: email,
    subject: "Your Password Reset Code",
    text: `Your password reset code is ${code}. It will expire in 10 minutes.`,
  });

  console.log(email, code, "====="); // for debug
  return { email };
};

export const verifyResetCode = async (email: string, code: string) => {
  const entry = await passwordResetModel.findOne({ email });
  console.log(entry,'entry--------')
  if (!entry) throw new Error("No reset code found. Please request again.");

  if (entry.expiresAt.getTime() < Date.now()) {
    await passwordResetModel.deleteOne({ email });
    throw new Error("Reset code expired. Please request again.");
  }

  if (entry.code !== code) throw new Error("Invalid reset code.");

  return { verified: true };
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const entry = await passwordResetModel.findOne({ email });
  if (!entry || entry.code !== code)
    throw new Error("Invalid or expired reset code.");

  const user = await User_Model.findOne({ email });
  if (!user) throw new Error("User not found");

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  await passwordResetModel.deleteOne({ email });
};

export const auth_services = {
  login_user_from_db,
  refresh_token_from_db,
  change_password_from_db,
  // forget_password_from_db,
  logoutRemoveToken,

  requestPasswordReset,
  verifyResetCode,
  resetPassword,
};
