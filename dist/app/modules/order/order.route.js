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
exports.OrderRoute = router;
