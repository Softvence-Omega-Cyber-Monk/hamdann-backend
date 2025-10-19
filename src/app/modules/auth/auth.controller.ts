import { is } from "zod/v4/locales";
import { configs } from "../../configs";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { auth_services } from "./auth.service";
import httpStatus from "http-status";

const login_user = catchAsync(async (req, res) => {
  // console.log(' req body form controller ',req.body)

  const result = await auth_services.login_user_from_db(req.body);

  // console.log(' login result from controller ',result)

  res.cookie("refreshToken", result.refreshToken, {
    secure: configs.env == "production",
    httpOnly: true,
  });
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successful !",
    data: {
      accessToken: result.accessToken,
      refresh_token: result.refreshToken,
      role: result?.role,
      userId: result?.userId,
      isPaidPlan: result?.isPaidPlan || false,
      subscribtionPlan: result?.subscribtionPlan || null,
    },
  });
});

const refresh_token = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await auth_services.refresh_token_from_db(refreshToken);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh token generated successfully!",
    data: result,
  });
});

const change_password = catchAsync(async (req, res) => {
  const user = req?.user;
  // console.log("User", user)
  const result = await auth_services.change_password_from_db(user!, req.body);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully!",
    data: result,
  });
});

const forget_password = catchAsync(async (req, res) => {
  const { email } = req?.body;
  await auth_services.forget_password_from_db(email);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset password link sent to your email!",
    data: null,
  });
});
const logoutRemoveToken = catchAsync(async (req, res) => {
  const { userId, deviceToken } = req?.body;
  await auth_services.logoutRemoveToken(userId, deviceToken);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logout successFull",
  });
});

export const auth_controllers = {
  login_user,
  refresh_token,
  change_password,
  forget_password,
  logoutRemoveToken
};
