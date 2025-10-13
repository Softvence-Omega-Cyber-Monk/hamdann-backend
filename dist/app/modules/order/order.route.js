"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoute = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const router = (0, express_1.Router)();
router.post("/create", order_controller_1.OrderController.createOrder); // Create Order
router.get("/getAll", order_controller_1.OrderController.getAllOrders); // Get All Orders
router.get("/get-single/:id", order_controller_1.OrderController.getOrderById); // Get Single Order
router.put("/update/:id", order_controller_1.OrderController.updateOrder); // Update Order
router.get("/current-orders/:userId", order_controller_1.OrderController.getCurrentOrders);
// Get all previous orders for a user
router.get("/previous-orders/:userId", order_controller_1.OrderController.getPreviousOrders);
// Get order statistics
router.get("/statistics/:userId", order_controller_1.OrderController.getUserOrderStatistics);
// Admin statistics route - returns only 4 metrics
router.get("/admin/statistics", order_controller_1.OrderController.getAdminStatistics);
//admin Order status counts route
router.get("/order-status-counts/:userId", order_controller_1.OrderController.getOrderStatusCounts);
// Order status summary route
router.get("/status-summary", order_controller_1.OrderController.getOrderStatusSummary);
// Activity list route
router.get("/admin/activities-list", order_controller_1.OrderController.getActivityList);
// Seller Analytics
router.get('/seller-analytics/:userId', order_controller_1.OrderController.getUserStatistics);
// Product list with delivery status base on seller ID
router.get("/seller/:sellerId", order_controller_1.OrderController.getProductListWithStatusBySellerId);
exports.OrderRoute = router;
