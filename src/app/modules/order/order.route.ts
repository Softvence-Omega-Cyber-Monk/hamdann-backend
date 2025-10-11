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

// Admin statistics route - returns only 4 metrics
router.get("/admin/statistics", OrderController.getAdminStatistics);

// Order status counts route
router.get("/order-status-counts",OrderController.getOrderStatusCounts);

// Order status summary route
router.get("/status-summary", OrderController.getOrderStatusSummary);

// Activity list route
router.get("/admin/activities-list", OrderController.getActivityList);

// Seller Analytics
router.get('/seller-analytics/:userId', OrderController.getUserStatistics);

export const OrderRoute = router;
