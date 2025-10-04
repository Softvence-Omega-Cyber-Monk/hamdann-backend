import { Router } from "express";
import { OrderController } from "./order.controller";

const router = Router();

router.post("/create", OrderController.createOrder); // Create Order
router.get("/getAll", OrderController.getAllOrders); // Get All Orders
router.get("/get-single/:id", OrderController.getOrderById); // Get Single Order
router.put("/update/:id", OrderController.updateOrder); // Update Order

export const OrderRoute = router;
