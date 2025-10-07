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
const appRouter = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/auth', route: auth_route_1.default },
    { path: "/user", route: user_route_1.default },
    { path: "/product", route: products_route_1.productRoutes },
    { path: "/cart", route: cart_route_1.CartRoute },
    { path: "/order", route: order_route_1.OrderRoute },
    { path: "/promotion", route: promotion_route_1.PromotionRoute }
];
moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
exports.default = appRouter;
