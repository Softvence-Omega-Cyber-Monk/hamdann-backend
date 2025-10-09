import { Router } from "express";
import { auth_controllers } from "./auth.controller";
import RequestValidator from "../../middlewares/request_validator";
import auth from "../../middlewares/auth";

const authRoute = Router()

authRoute.post("/login", auth_controllers.login_user)


authRoute.post('/refresh-token', auth('Admin','Buyer','Seller'), auth_controllers.refresh_token);
authRoute.post(
    '/change-password',
    auth("Buyer", "Seller", "Admin"),
    auth_controllers.change_password,
);
authRoute.post(
    '/forgot-password',
    // RequestValidator(auth_validation.forgotPassword),
    auth_controllers.forget_password,
);



export default authRoute;
