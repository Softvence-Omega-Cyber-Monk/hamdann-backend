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
exports.OrderService = void 0;
const order_model_1 = require("./order.model");
const mongoose_1 = require("mongoose");
// Utility function to calculate subtotal, shipping cost, and total amount
const calculateOrderAmounts = (items) => {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    // Calculate shipping cost as 10% of the subtotal
    const shippingCost = subtotal * 0.1; // 10% of subtotal
    // Calculate tax as 5% of the subtotal
    const tax = subtotal * 0.05; // 5% of subtotal
    // Calculate the total amount (subtotal + shipping cost + tax)
    const totalAmount = subtotal + shippingCost + tax;
    return { subtotal, shippingCost, tax, totalAmount };
};
// Create Order
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    // Calculate order amounts
    const { subtotal, shippingCost, tax, totalAmount } = calculateOrderAmounts(orderData.items);
    try {
        const order = new order_model_1.Order(Object.assign(Object.assign({}, orderData), { subtotal,
            shippingCost,
            tax, // Include the tax in the order
            totalAmount }));
        // Save and return the created order
        return yield order.save();
    }
    catch (error) {
        throw new Error(`Failed to create order: ${error.message}`);
    }
});
// Get all orders with optional filters
const getAllOrders = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    const query = {};
    if (filters.userId)
        query.userId = filters.userId;
    if (filters.status)
        query.status = filters.status;
    try {
        return yield order_model_1.Order.find(query)
            .populate("userId", "name email")
            .populate("items.productId", "name price")
            .sort({ createdAt: -1 }); // newest orders first
    }
    catch (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
    }
});
// Get a single order by ID
const getOrderById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid order ID");
    }
    try {
        return yield order_model_1.Order.findById(orderId)
            .populate("userId", "name email")
            .populate("items.productId", "name price");
    }
    catch (error) {
        throw new Error(`Failed to fetch order: ${error.message}`);
    }
});
// Update an order
const updateOrder = (orderId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid order ID");
    }
    try {
        return yield order_model_1.Order.findByIdAndUpdate(orderId, updateData, { new: true })
            .populate("userId", "name email")
            .populate("items.productId", "name price");
    }
    catch (error) {
        throw new Error(`Failed to update order: ${error.message}`);
    }
});
exports.OrderService = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
};
