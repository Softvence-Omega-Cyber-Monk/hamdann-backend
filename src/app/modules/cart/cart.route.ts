import { Router } from "express";
import { CartController } from "./cart.controller";

const router = Router();

// Create Cart Route
router.post("/create", CartController.createCart);

export const CartRoute = router;
