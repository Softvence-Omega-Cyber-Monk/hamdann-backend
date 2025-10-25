"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRoutes = void 0;
// src/modules/subscription/subscription.route.ts
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("./subscription.controller");
const router = express_1.default.Router();
// POST → create new plan
router.post("/create", subscription_controller_1.subscriptionController.createSubscriptionController);
// GET → all plans
router.get("/getAll", subscription_controller_1.subscriptionController.getAllSubscriptionsController);
// GET → single plan by ID
router.get("/getSingleId/:id", subscription_controller_1.subscriptionController.getSubscriptionByIdController);
// PUT → update plan
router.put("/update/:id", subscription_controller_1.subscriptionController.updateSubscriptionController);
// DELETE → delete plan
router.delete("/delete/:id", subscription_controller_1.subscriptionController.deleteSubscriptionController);
exports.subscriptionRoutes = router;
