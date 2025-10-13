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
exports.sendNotification = void 0;
const firebaseAdmin_1 = require("../configs/firebaseAdmin");
const user_schema_1 = require("../modules/user/user.schema");
const sendNotification = (userId, title, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.User_Model.findById(userId);
        if (!user || !user.fcmToken) {
            console.log(`❌ No FCM token for user ${userId}`);
            return;
        }
        const message = {
            notification: { title, body },
            token: user.fcmToken,
        };
        const response = yield firebaseAdmin_1.messaging.send(message);
        console.log("✅ Notification sent:", response);
    }
    catch (err) {
        console.error("⚠️ Error sending notification:", err);
    }
});
exports.sendNotification = sendNotification;
