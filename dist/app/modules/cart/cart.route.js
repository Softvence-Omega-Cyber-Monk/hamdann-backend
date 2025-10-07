"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoute = void 0;
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const router = (0, express_1.Router)();
// Create Cart Route
router.post("/create", cart_controller_1.CartController.createCart);
router.get("/get-single/:userId", cart_controller_1.CartController.getSingleCart);
exports.CartRoute = router;
