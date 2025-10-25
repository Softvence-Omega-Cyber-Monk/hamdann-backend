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
exports.checkUserSubscription = void 0;
const user_schema_1 = require("../modules/user/user.schema");
// middleware/subscriptionCheck.ts
const checkUserSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.body.userId;
        if (!userId) {
            return next();
        }
        const user = yield user_schema_1.User_Model.findById(userId);
        if (!user) {
            return next();
        }
        // Check if subscription has expired in real-time
        if (user.isSubscriptionActive && user.subscriptionExpiryDate && new Date() > user.subscriptionExpiryDate) {
            // Auto-reset immediately if expired
            yield user_schema_1.User_Model.findByIdAndUpdate(userId, {
                productAddedPowerQuantity: 0,
                isSubscriptionActive: false,
                isPaidPlan: false,
                subscribtionPlan: null,
                subscriptionResetAt: new Date()
            });
            console.log(`🟡 Real-time reset for user ${userId}`);
        }
        next();
    }
    catch (error) {
        console.error("Error in subscription check middleware:", error);
        next();
    }
});
exports.checkUserSubscription = checkUserSubscription;
