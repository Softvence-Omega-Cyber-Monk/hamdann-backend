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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_model_1 = require("./order.model");
const mongoose_1 = require("mongoose");
const products_model_1 = require("../products/products.model");
const user_schema_1 = require("../user/user.schema");
const dayjs_1 = __importDefault(require("dayjs"));
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
const notificationHelper_1 = require("../../utils/notificationHelper");
dayjs_1.default.extend(relativeTime_1.default);
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
        const order = yield order_model_1.Order.create(Object.assign(Object.assign({}, orderData), { subtotal,
            shippingCost,
            tax, // Include the tax in the order
            totalAmount }));
        // Notify all customers
        const productIds = order.items.map((item) => item.productId);
        console.log("product ids ", productIds);
        const products = yield products_model_1.Product.find({ _id: { $in: productIds } });
        console.log("products---- ", products);
        for (const product of products) {
            const customers = yield products_model_1.Product.find({ userId: product.userId });
            console.log("customers ", customers);
            console.log("notifying ", customers);
            yield (0, notificationHelper_1.sendNotification)(customers[0].userId.toString(), "🛒 New Order Placed!", `An order has been placed for this ${product.name}. Check it out!`);
        }
        // const customers = await User_Model.find({ role: "Buyer" });
        // for (const buyer of customers) {
        //   await sendNotification(
        //     buyer._id.toString(),
        //     "🛒 New Order Added!",
        //     ` is now available!`
        //   );
        // }
        // Save and return the created order
        return order;
    }
    catch (error) {
        throw new Error(`Failed to create order: ${error.message}`);
    }
});
const getAllOrders = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    try {
        const query = {};
        // Apply the filter from controller
        if (filters.status) {
            query.status = filters.status;
        }
        const orders = yield order_model_1.Order.find(query)
            .populate({
            path: "userId",
            select: "name email",
        })
            .populate({
            path: "items.productId",
            select: "name price stock image",
        })
            .sort({ createdAt: -1 });
        return orders;
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
const getCurrentOrdersService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentStatuses = [
        "placed",
        "payment_processed",
        "shipped",
        "out_for_delivery",
    ];
    const orders = yield order_model_1.Order.find({
        userId,
        status: { $in: currentStatuses },
    }).sort({ createdAt: -1 });
    return orders;
});
// 🟣 Get previous (completed/cancelled) orders
const getPreviousOrdersService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const previousStatuses = ["delivered", "cancelled", "returned"];
    const orders = yield order_model_1.Order.find({
        userId,
        status: { $in: previousStatuses },
    }).sort({ createdAt: -1 });
    return orders;
});
// Add this to your existing order.service.ts
const getUserOrderStatistics = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalOrders = yield order_model_1.Order.countDocuments({ userId });
        const pendingOrders = yield order_model_1.Order.countDocuments({
            userId,
            status: {
                $in: ["placed", "payment_processed", "shipped", "out_for_delivery"],
            },
        });
        // console.log('pending orders ',pendingOrders)
        const salesResult = yield order_model_1.Order.aggregate([
            {
                $match: {
                    userId: new mongoose_1.Types.ObjectId(userId),
                },
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                },
            },
        ]);
        // console.log('sales reslult ',salesResult)
        const returnedOrders = yield order_model_1.Order.countDocuments({
            userId,
            status: "returned",
        });
        const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;
        return {
            totalOrders,
            pendingOrders,
            totalSales,
            returnedOrders,
        };
    }
    catch (error) {
        throw new Error(`Failed to get order statistics: ${error.message}`);
    }
});
const getAdminStatisticsService = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [revenueResult, totalOrders, totalProducts, activeUsers] = yield Promise.all([
            // Total Sales (Revenue)
            order_model_1.Order.aggregate([
                {
                    $match: {
                        status: { $ne: "cancelled" },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: "$totalAmount" },
                    },
                },
            ]),
            // Total Orders
            order_model_1.Order.countDocuments({ status: { $ne: "cancelled" } }),
            // Total Products
            products_model_1.Product.countDocuments(),
            // Active Users
            user_schema_1.User_Model.countDocuments({ isDeleted: false }),
        ]);
        return {
            totalSales: ((_a = revenueResult[0]) === null || _a === void 0 ? void 0 : _a.totalSales) || 0,
            totalOrders,
            activeUsers,
            totalProducts,
        };
    }
    catch (error) {
        console.error("Error in getAdminStatisticsService:", error);
        throw new Error(error instanceof Error
            ? error.message
            : "Failed to fetch admin statistics");
    }
});
const getOrderStatusCountsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists and is a seller
    const existingUser = yield user_schema_1.User_Model.findById(userId);
    if (!existingUser) {
        throw new Error("User not found");
    }
    if (existingUser.role !== "Seller") {
        throw new Error("Only seller can access this data");
    }
    try {
        // Get counts and order lists in parallel
        const [newOrdersCount, processingCount, completedCount, newOrdersList, processingOrdersList, completedOrdersList,] = yield Promise.all([
            // Counts
            order_model_1.Order.countDocuments({
                userId,
                status: "placed",
            }),
            order_model_1.Order.countDocuments({
                userId,
                status: {
                    $in: ["payment_processed", "shipped", "out_for_delivery"],
                },
            }),
            order_model_1.Order.countDocuments({
                userId,
                status: "delivered",
            }),
            // Order Lists
            order_model_1.Order.find({
                userId,
                status: "placed",
            })
                .populate("items.productId", "name price productImages")
                .sort({ createdAt: -1 }),
            order_model_1.Order.find({
                userId,
                status: {
                    $in: ["payment_processed", "shipped", "out_for_delivery"],
                },
            })
                .populate("items.productId", "name price productImages")
                .sort({ createdAt: -1 }),
            order_model_1.Order.find({
                userId,
                status: "delivered",
            })
                .populate("items.productId", "name price productImages")
                .sort({ createdAt: -1 }),
        ]);
        return {
            counts: {
                newOrders: newOrdersCount,
                processing: processingCount,
                completed: completedCount,
            },
            newOrders: newOrdersList,
            processingOrders: processingOrdersList,
            completedOrders: completedOrdersList,
        };
    }
    catch (error) {
        console.error("Error in getOrderStatusCountsService:", error);
        throw new Error(error instanceof Error
            ? error.message
            : "Failed to fetch order status counts and lists");
    }
});
const getOrderStatusSummaryService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get total orders count
        const totalOrders = yield order_model_1.Order.countDocuments();
        if (totalOrders === 0) {
            return [];
        }
        // Get count for each status
        const statusCounts = yield order_model_1.Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        // Map to the required format and calculate percentages
        const statusSummary = statusCounts.map((statusCount) => {
            const percentage = Math.round((statusCount.count / totalOrders) * 100);
            return {
                status: statusCount._id,
                count: statusCount.count,
                percentage: percentage,
            };
        });
        return statusSummary;
    }
    catch (error) {
        console.error("Error in getOrderStatusSummaryService:", error);
        throw new Error(error instanceof Error
            ? error.message
            : "Failed to fetch order status summary");
    }
});
function capitalizeFirstLetter(str) {
    if (!str)
        return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const getActivityListService = () => __awaiter(void 0, void 0, void 0, function* () {
    // 1️⃣ Fetch Orders
    const orders = yield order_model_1.Order.find()
        .populate("userId", "email")
        .sort({ createdAt: -1 })
        .exec();
    const orderActivities = orders.map((order) => {
        var _a;
        // Cast through unknown first
        const user = order.userId;
        const createdAt = (_a = order.createdAt) !== null && _a !== void 0 ? _a : new Date();
        return {
            Type: "Order",
            Description: `New order #${order.orderNumber}`,
            User: user ? user.email : order.contactInfo.email,
            Amount: `$${order.totalAmount}`,
            Status: capitalizeFirstLetter(order.status),
            Time: (0, dayjs_1.default)(order.createdAt).fromNow(),
            timestamp: createdAt.getTime(),
        };
    });
    // 2️⃣ Fetch Users
    const users = yield user_schema_1.User_Model.find().sort({ createdAt: -1 }).exec();
    const userActivities = users.map((user) => ({
        Type: "User",
        Description: "New user registration",
        User: user.email,
        Amount: "-", // no amount
        Status: "Active",
        Time: (0, dayjs_1.default)(user.createdAt).fromNow(),
    }));
    const products = yield products_model_1.Product.find()
        .populate("userId", "email") // Populate the user who created the product
        .sort({ updatedAt: -1 })
        .exec();
    const productActivities = products.map((product) => {
        // Cast through unknown first to access populated fields
        const createdByUser = product.userId;
        return {
            Type: "Product",
            Description: `Product ${product.createdAt === product.updatedAt ? "created" : "updated"}: ${product.name}`,
            User: createdByUser ? createdByUser.email : "admin@store.com",
            Amount: "-",
            Status: product.createdAt === product.updatedAt ? "Created" : "Updated",
            Time: (0, dayjs_1.default)(product.updatedAt).fromNow(),
        };
    });
    // 4️⃣ Combine all and sort by Time (descending)
    const allActivities = [
        ...orderActivities,
        ...userActivities,
        ...productActivities,
    ];
    allActivities.sort((a, b) => {
        // Convert "2 min ago", "5 min ago" etc. to proper sorting
        // This is a simple approach - for better accuracy, consider using timestamps
        // return a.Time.localeCompare(b.Time);
        const getTimeValue = (timeStr) => {
            if (timeStr.includes("min"))
                return parseInt(timeStr);
            if (timeStr.includes("hour"))
                return parseInt(timeStr) * 60;
            if (timeStr.includes("day"))
                return parseInt(timeStr) * 1440;
            return 0;
        };
        return getTimeValue(a.Time) - getTimeValue(b.Time);
    });
    return allActivities;
});
const getUserStatisticsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID");
        }
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        // Get all orders for the user
        const [orders, allOrders] = yield Promise.all([
            order_model_1.Order.find({ userId: userObjectId }),
            order_model_1.Order.find({ userId: userObjectId }).populate("items.productId"),
        ]);
        if (orders.length === 0) {
            return {
                totalRevenue: 0,
                totalOrders: 0,
                conversionRate: 0,
                productsSold: 0,
                averageOrderValue: 0,
            };
        }
        // Calculate total revenue (only from delivered orders)
        const totalRevenue = orders
            .filter((order) => order.status === "delivered")
            .reduce((sum, order) => sum + order.totalAmount, 0);
        // Calculate total orders
        const totalOrders = yield order_model_1.Order.countDocuments({
            status: { $ne: "cancelled" },
        });
        // Calculate products sold (only from delivered orders)
        const productsSold = allOrders
            .filter((order) => order.status === "delivered")
            .reduce((sum, order) => sum +
            order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        // Calculate average order value
        const averageOrderValue = totalRevenue /
            orders.filter((order) => order.status === "delivered").length || 0;
        // Calculate conversion rate (delivered orders / total orders)
        const deliveredOrders = orders.filter((order) => order.status === "delivered").length;
        const conversionRate = (deliveredOrders / totalOrders) * 100;
        return {
            totalRevenue: Number(totalRevenue.toFixed(2)),
            totalOrders,
            conversionRate: Number(conversionRate.toFixed(2)),
            productsSold,
            averageOrderValue: Number(averageOrderValue.toFixed(2)),
        };
    }
    catch (error) {
        throw new Error(`Failed to get user statistics: ${error.message}`);
    }
});
const getProductListWithStatusBySellerIdService = (sellerId_1, ...args_1) => __awaiter(void 0, [sellerId_1, ...args_1], void 0, function* (sellerId, options = {}) {
    const { status, page = 1, limit = 10 } = options;
    // Filter orders by seller (userId) and status if provided
    const filter = { userId: sellerId };
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
    const skip = (page - 1) * limit;
    const orders = yield order_model_1.Order.find(filter)
        .sort({ createdAt: -1 }) // latest orders first
        .skip(skip)
        .limit(limit)
        .exec();
    const total = yield order_model_1.Order.countDocuments(filter);
    return {
        orders,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
});
// Get recent orders for seller - userId IS the sellerId
const getRecentOrdersForSellerService = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10) {
    var _a, _b, _c;
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
    }
    try {
        const skip = (page - 1) * limit;
        const aggregationPipeline = [
            // Match orders where userId = sellerId
            { $match: { userId: new mongoose_1.Types.ObjectId(userId) } },
            // Lookup product details for items
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            // Sort by most recent
            { $sort: { createdAt: -1 } },
            // Facet for pagination
            {
                $facet: {
                    metadata: [{ $count: "totalCount" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        // Project final format
                        {
                            $project: {
                                orderNumber: 1,
                                status: 1,
                                totalAmount: 1,
                                currency: 1,
                                createdAt: 1,
                                items: {
                                    $map: {
                                        input: "$items",
                                        as: "item",
                                        in: {
                                            name: {
                                                $let: {
                                                    vars: {
                                                        matchedProduct: {
                                                            $arrayElemAt: [
                                                                {
                                                                    $filter: {
                                                                        input: "$productDetails",
                                                                        as: "product",
                                                                        cond: { $eq: ["$$product._id", "$$item.productId"] }
                                                                    }
                                                                },
                                                                0
                                                            ]
                                                        }
                                                    },
                                                    in: { $ifNull: ["$$matchedProduct.name", "Product"] }
                                                }
                                            },
                                            quantity: "$$item.quantity",
                                            price: "$$item.price",
                                            total: { $multiply: ["$$item.price", "$$item.quantity"] }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ];
        const result = yield order_model_1.Order.aggregate(aggregationPipeline);
        const orders = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const totalCount = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.metadata[0]) === null || _c === void 0 ? void 0 : _c.totalCount) || 0;
        const totalPages = Math.ceil(totalCount / limit);
        // Format response
        const formattedOrders = orders.map((order) => ({
            orderNumber: order.orderNumber,
            status: order.status,
            date: order.createdAt,
            items: order.items,
            totalAmount: order.totalAmount,
            currency: order.currency
        }));
        return {
            success: true,
            data: formattedOrders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders: totalCount,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch seller orders: ${error.message}`);
    }
});
exports.OrderService = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    getCurrentOrdersService,
    getPreviousOrdersService,
    getUserOrderStatistics,
    getAdminStatisticsService,
    getOrderStatusCountsService,
    getOrderStatusSummaryService,
    getActivityListService,
    getUserStatisticsService,
    getProductListWithStatusBySellerIdService,
    getRecentOrdersForSellerService,
};
