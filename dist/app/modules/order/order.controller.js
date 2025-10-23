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
        res.status(201).json({
            success: true,
            data: {
                orderId: order._id,
                status: order.status,
                items: order.items,
            },
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) {
            if (status === "pending") {
                filter.status = {
                    $in: ["placed", "payment_processed", "out_for_delivery", "pending"],
                };
            }
            else {
                filter.status = status;
            }
        }
        const orders = yield order_service_1.OrderService.getAllOrders(filter);
        res.status(200).json({
            success: true,
            data: orders,
            count: orders.length,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
// Get Single Order
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_service_1.OrderService.getOrderById(req.params.id);
        if (!order) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
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
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;
        if (!status) {
            return res
                .status(400)
                .json({ success: false, message: "Status is required" });
        }
        const updatedOrder = yield order_service_1.OrderService.updateOrderStatus(orderId, status);
        if (!updatedOrder) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        }
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update order status",
        });
    }
});
const getCurrentOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield order_service_1.OrderService.getCurrentOrdersService(userId);
        res.status(200).json({
            success: true,
            message: "Current orders fetched successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch current orders",
        });
    }
});
// 🟣 Get previous orders
const getPreviousOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield order_service_1.OrderService.getPreviousOrdersService(userId);
        res.status(200).json({
            success: true,
            message: "Previous orders fetched successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch previous orders",
        });
    }
});
// Add this to your existing order.controller.ts
const getUserOrderStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const statistics = yield order_service_1.OrderService.getUserOrderStatistics(userId);
        res.status(200).json({
            success: true,
            message: "Order statistics fetched successfully",
            data: statistics,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch order statistics",
        });
    }
});
const getAdminStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statistics = yield order_service_1.OrderService.getAdminStatisticsService();
        res.status(200).json({
            success: true,
            message: "Admin statistics retrieved successfully",
            data: statistics,
        });
    }
    catch (error) {
        console.error("Error in getAdminStatistics controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// const getOrderStatusCounts = async (req: Request, res: Response) => {
//   const userId = req.params.userId;
//   try {
//     const statusCounts = await OrderService.getOrderStatusCountsService(userId);
//     res.status(200).json({
//       success: true,
//       message: "Order status counts retrieved successfully",
//       data: statusCounts,
//     });
//   } catch (error) {
//     console.error("Error in getOrderStatusCounts controller:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// };
const getOrderStatusCountsBySellerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // If using auth middleware, you can get sellerId from req.user.id
        const sellerId = req.params.sellerId;
        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: "Seller ID is required",
            });
        }
        const data = yield order_service_1.OrderService.getOrderStatusCountsBySellerService(sellerId);
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error("Error in getOrderStatusCountsBySellerController:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch seller order status counts",
        });
    }
});
const getOrderStatusSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statusSummary = yield order_service_1.OrderService.getOrderStatusSummaryService();
        res.status(200).json({
            success: true,
            message: "Order status summary retrieved successfully",
            data: statusSummary,
        });
    }
    catch (error) {
        console.error("Error in getOrderStatusSummary controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
const getActivityList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activities = yield order_service_1.OrderService.getActivityListService();
        res.status(200).json({
            success: true,
            message: "Activity list retrieved successfully",
            data: activities,
        });
    }
    catch (error) {
        console.error("Error in getActivityList controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
const getUserStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const statistics = yield order_service_1.OrderService.getUserStatisticsService(userId);
        res.status(200).json({
            success: true,
            message: "Seller statistics fetched successfully",
            data: statistics,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch Seller statistics",
        });
    }
});
const getProductListWithStatusBySellerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerId } = req.params;
        const { status, page, limit, search } = req.query;
        const result = yield order_service_1.OrderService.getProductListWithStatusBySellerIdService(sellerId, {
            status: status,
            page: Number(page),
            limit: Number(limit),
            search: search
        });
        if (!result.orders.length) {
            return res
                .status(404)
                .json({ success: false, message: "No orders found" });
        }
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// Get recent orders for seller with pagination
// const getRecentOrdersForSellerController = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { userId } = req.params;
//     const { page, limit } = req.query;
//     if (!userId) {
//       res.status(400).json({
//         success: false,
//         message: "User ID is required in params"
//       });
//       return;
//     }
//     const result = await OrderService.getRecentOrdersForSellerService(userId);
//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error("Error fetching seller orders:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
const getRecentOrdersForSellerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { page, limit } = req.query;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        const pageNumber = page ? parseInt(page) : 1;
        const limitNumber = limit ? parseInt(limit) : 10;
        const result = yield order_service_1.OrderService.getRecentOrdersForSellerService(userId, pageNumber, limitNumber);
        res.status(200).json({
            success: true,
            data: result.orders,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error("Error fetching seller orders:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch orders"
        });
    }
});
const getSellerStatisticsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerId } = req.params;
        if (!sellerId) {
            res.status(400).json({
                success: false,
                message: "Seller ID is required",
            });
            return;
        }
        const statistics = yield order_service_1.OrderService.getSellerStatisticsService(sellerId);
        res.status(200).json({
            success: true,
            message: "Seller statistics fetched successfully",
            data: statistics,
        });
    }
    catch (error) {
        console.error("Error in getSellerStatisticsController:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch seller statistics",
        });
    }
});
const getSellerOrderStatisticsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerId } = req.params;
        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: "Seller ID is required",
            });
        }
        const statistics = yield order_service_1.OrderService.getSellerOrderStatisticsService(sellerId);
        return res.status(200).json({
            success: true,
            message: "Seller order statistics fetched successfully",
            data: statistics,
        });
    }
    catch (error) {
        console.error("Error in getSellerOrderStatisticsController:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch seller order statistics",
        });
    }
});
exports.OrderController = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    updateOrderStatus,
    getCurrentOrders,
    getPreviousOrders,
    getUserOrderStatistics,
    getAdminStatistics,
    getOrderStatusCountsBySellerController,
    getOrderStatusSummary,
    getActivityList,
    getUserStatistics,
    getProductListWithStatusBySellerId,
    getRecentOrdersForSellerController,
    getSellerStatisticsController,
    getSellerOrderStatisticsController,
};
