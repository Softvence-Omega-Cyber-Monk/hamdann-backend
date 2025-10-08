import { Router } from "express";
import { OrderController } from "./order.controller";

const router = Router();

router.post("/create", OrderController.createOrder); // Create Order
router.get("/getAll", OrderController.getAllOrders); // Get All Orders
router.get("/get-single/:id", OrderController.getOrderById); // Get Single Order
router.put("/update/:id", OrderController.updateOrder); // Update Order

router.get("/current-orders/:userId", OrderController.getCurrentOrders);

// Get all previous orders for a user
router.get("/previous-orders/:userId", OrderController.getPreviousOrders);

// Get order statistics
router.get("/statistics/:userId", OrderController.getUserOrderStatistics);
export const OrderRoute = router;
