import { Router, Request, Response, NextFunction } from "express";
import { user_controllers } from "./user.controller";
import { create_user, update_user } from "./user.validation";
import { z } from "zod";

const userRoute = Router();

// Generic validation middleware
const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
    req.body = result.data;
    next();
  };

// Create user
userRoute.post("/create", validate(create_user), user_controllers.create_user);

// Get single user by ID
userRoute.get("/get-single/:id", user_controllers.get_single_user);

// Get all users
userRoute.get("/getAll", user_controllers.get_all_users);

// Update user
userRoute.put(
  "/update/:id",
  validate(update_user),
  user_controllers.update_single_user
);

// Soft delete user
userRoute.put("/delete/:id", user_controllers.delete_user);



export default userRoute;
