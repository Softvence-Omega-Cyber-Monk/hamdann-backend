import { Router } from "express";
import { auth_controllers } from "./auth.controller";
import RequestValidator from "../../middlewares/request_validator";
import { auth_validation } from "./auth.validation";
import auth from "../../middlewares/auth";

const authRoute = Router()

authRoute.post("/login", auth_controllers.login_user)


authRoute.post('/refresh-token', auth_controllers.refresh_token);
authRoute.post(
    '/change-password',
    auth("ADMIN", "USER"),
    RequestValidator(auth_validation.changePassword),
    auth_controllers.change_password,
);
authRoute.post(
    '/forgot-password',
    RequestValidator(auth_validation.forgotPassword),
    auth_controllers.forget_password,
);
authRoute.post(
    '/reset-password',
    RequestValidator(auth_validation.resetPassword),
    auth_controllers.reset_password,
);


export default authRoute;
