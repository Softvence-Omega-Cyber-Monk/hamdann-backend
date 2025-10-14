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
exports.markAsRead = exports.getUserNotifications = exports.createNotification = void 0;
const notifications_model_1 = require("./notifications.model");
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, body, userProfile } = req.body;
        const notification = yield notifications_model_1.NotificationModel.create({
            userId,
            title,
            body,
            userProfile,
            timestamp: new Date(),
        });
        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data: notification,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.createNotification = createNotification;
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const notifications = yield notifications_model_1.NotificationModel.find({ userId }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            data: notifications,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.getUserNotifications = getUserNotifications;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updated = yield notifications_model_1.NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.markAsRead = markAsRead;
