"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./app/modules/auth/auth.route"));
const user_route_1 = __importDefault(require("./app/modules/user/user.route"));
const products_route_1 = require("./app/modules/products/products.route");
const order_route_1 = require("./app/modules/order/order.route");
const cart_route_1 = require("./app/modules/cart/cart.route");
const promotion_route_1 = require("./app/modules/promotion/promotion.route");
const support_route_1 = require("./app/modules/supports/support.route");
const payment_route_1 = require("./app/modules/payment/payment.route");
const notification_route_1 = require("./app/modules/notifications/notification.route");
const wishListedProducts_route_1 = require("./app/modules/wishListedProducts/wishListedProducts.route");
const requestRefund_route_1 = require("./app/modules/requestRefund/requestRefund.route");
const category_route_1 = require("./app/modules/category/category.route");
const subscription_route_1 = require("./app/modules/subscriptions/subscription.route");
const appRouter = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/auth', route: auth_route_1.default },
    { path: "/user", route: user_route_1.default },
    { path: "/category", route: category_route_1.categoryRoute },
    { path: "/product", route: products_route_1.productRoutes },
    { path: "/cart", route: cart_route_1.CartRoute },
    { path: "/order", route: order_route_1.OrderRoute },
    { path: "/promotion", route: promotion_route_1.PromotionRoute },
    { path: "/support", route: support_route_1.supportRoutes },
    { path: "/payment", route: payment_route_1.paymentRoutes },
    { path: "/notification", route: notification_route_1.notificationRoutes },
    { path: "/wishListProducts", route: wishListedProducts_route_1.withlistProductsRoutes },
    { path: "/request-refund", route: requestRefund_route_1.RequestRefundRoutes },
    { path: "/subscription-plan", route: subscription_route_1.subscriptionRoutes },
];
moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
exports.default = appRouter;
