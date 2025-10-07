"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("./order.service");
// Create Order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_service_1.OrderService.createOrder(req.body);
        res.status(201).json({ success: true, data: {
                orderId: order._id,
                status: order.status,
                items: order.items,
            } });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
// Get All Orders
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.OrderService.getAllOrders();
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// Get Single Order
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_service_1.OrderService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// Update Order
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_service_1.OrderService.updateOrder(req.params.id, req.body);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.OrderController = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
};
