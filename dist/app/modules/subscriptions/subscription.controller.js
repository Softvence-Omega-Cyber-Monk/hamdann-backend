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
exports.subscriptionController = void 0;
const subscription_service_1 = require("./subscription.service");
/**
 * POST /api/subscriptions
 */
const createSubscriptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPlan = yield subscription_service_1.subscriptionService.createSubscriptionService(req.body);
        res.status(201).json({
            success: true,
            message: "Subscription plan created successfully",
            data: newPlan,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * GET /api/subscriptions
 */
const getAllSubscriptionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield subscription_service_1.subscriptionService.getAllSubscriptionsService();
        res.status(200).json({
            success: true,
            message: "Subscription plans fetched successfully",
            data: plans,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * GET /api/subscriptions/:id
 */
const getSubscriptionByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plan = yield subscription_service_1.subscriptionService.getSubscriptionByIdService(req.params.id);
        if (!plan)
            return res
                .status(404)
                .json({ success: false, message: "Plan not found" });
        res.status(200).json({
            success: true,
            message: "Subscription plan fetched successfully",
            data: plan,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * PUT /api/subscriptions/:id
 */
const updateSubscriptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPlan = yield subscription_service_1.subscriptionService.updateSubscriptionService(req.params.id, req.body);
        if (!updatedPlan)
            return res
                .status(404)
                .json({ success: false, message: "Plan not found" });
        res.status(200).json({
            success: true,
            message: "Subscription plan updated successfully",
            data: updatedPlan,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * DELETE /api/subscriptions/:id
 */
const deleteSubscriptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPlan = yield subscription_service_1.subscriptionService.deleteSubscriptionService(req.params.id);
        if (!deletedPlan)
            return res
                .status(404)
                .json({ success: false, message: "Plan not found" });
        res.status(200).json({
            success: true,
            message: "Subscription plan deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.subscriptionController = {
    createSubscriptionController,
    getAllSubscriptionsController,
    getSubscriptionByIdController,
    updateSubscriptionController,
    deleteSubscriptionController,
};
