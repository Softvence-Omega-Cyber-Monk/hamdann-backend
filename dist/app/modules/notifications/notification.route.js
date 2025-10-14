"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
// src/routes/notification.routes.ts
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("./notification.controller");
const router = express_1.default.Router();
router.post("/create", notification_controller_1.createNotification); // create new notification
router.get("/getAll/:userId", notification_controller_1.getUserNotifications); // get all notifications by user
router.patch("/markAsRead/:id/read", notification_controller_1.markAsRead); // mark notification as read
exports.notificationRoutes = router;
