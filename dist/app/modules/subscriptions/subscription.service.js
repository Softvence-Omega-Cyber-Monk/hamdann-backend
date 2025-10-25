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
exports.subscriptionService = void 0;
// src/modules/subscription/subscription.service.ts
const subscription_model_1 = require("./subscription.model");
/**
 * ✅ Create a new subscription plan
 */
const createSubscriptionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newPlan = yield subscription_model_1.Subscription.create(payload);
    return newPlan;
});
/**
 * ✅ Get all subscription plans
 */
const getAllSubscriptionsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield subscription_model_1.Subscription.find().sort({ createdAt: -1 });
});
/**
 * ✅ Get a single subscription by ID
 */
const getSubscriptionByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield subscription_model_1.Subscription.findById(id);
});
/**
 * ✅ Update a subscription plan
 */
const updateSubscriptionService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield subscription_model_1.Subscription.findByIdAndUpdate(id, payload, { new: true });
});
/**
 * ✅ Delete a subscription plan
 */
const deleteSubscriptionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield subscription_model_1.Subscription.findByIdAndDelete(id);
});
exports.subscriptionService = {
    createSubscriptionService,
    getAllSubscriptionsService,
    getSubscriptionByIdService,
    updateSubscriptionService,
    deleteSubscriptionService,
};
