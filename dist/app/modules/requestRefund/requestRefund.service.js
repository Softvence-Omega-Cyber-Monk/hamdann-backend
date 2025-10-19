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
exports.RequestRefundService = void 0;
const mongoose_1 = require("mongoose");
const requestRefund_model_1 = require("./requestRefund.model");
const order_model_1 = require("../order/order.model");
const cloudinary_1 = require("../../utils/cloudinary");
const createRefundRequest = (refundData, productImageFiles) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate if order exists
        const orderExists = yield order_model_1.Order.findById(refundData.orderId);
        if (!orderExists) {
            throw new Error("Order not found");
        }
        // Check if refund request already exists for this order
        const existingRefund = yield requestRefund_model_1.RequestRefund.findOne({
            orderId: refundData.orderId,
        });
        if (existingRefund) {
            throw new Error("Refund request already exists for this order");
        }
        // Upload multiple product images to Cloudinary if files exist
        if (productImageFiles && productImageFiles.length > 0) {
            const filePaths = productImageFiles.map((file) => file.path);
            const imageUrls = yield (0, cloudinary_1.uploadMultipleImages)(filePaths, "refund-requests");
            refundData.productImage = imageUrls;
        }
        else {
            throw new Error("At least one product image is required");
        }
        // Create refund request
        const refundRequest = yield requestRefund_model_1.RequestRefund.create(refundData);
        yield order_model_1.Order.findByIdAndUpdate(refundData.orderId, {
            status: "return_requested",
            "statusDates.returnRequestedAt": new Date(),
            $set: {
                // Keep existing status dates, only update returnRequestedAt
                "statusDates.returnRequestedAt": new Date(),
            },
        }, { new: true });
        return refundRequest;
    }
    catch (error) {
        throw new Error(`Failed to create refund request: ${error.message}`);
    }
});
const getRefundRequestByIdService = (refundId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(refundId)) {
        throw new Error("Invalid refund request ID");
    }
    try {
        const refundRequest = yield requestRefund_model_1.RequestRefund.findOne({ orderId: refundId });
        console.log("reue", refundRequest);
        return refundRequest;
    }
    catch (error) {
        throw new Error(`Failed to fetch refund request: ${error.message}`);
    }
});
const acceptRefundRequest = (refundId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(refundId)) {
        throw new Error("Invalid refund request ID");
    }
    try {
        // Find the refund request first
        const refundRequest = yield requestRefund_model_1.RequestRefund.findOne({ orderId: refundId });
        console.log('resuset ', refundRequest);
        if (!refundRequest) {
            throw new Error("Refund request not found");
        }
        // Check if already accepted
        if (refundRequest.isAccepted) {
            throw new Error("Refund request is already accepted");
        }
        // Update isAccepted to true
        const updatedRefundRequest = yield requestRefund_model_1.RequestRefund.findOneAndUpdate({ orderId: refundId }, {
            $set: {
                isAccepted: true,
            },
        }, { new: true });
        return updatedRefundRequest;
    }
    catch (error) {
        throw new Error(`Failed to accept refund request: ${error.message}`);
    }
});
exports.RequestRefundService = {
    createRefundRequest,
    getRefundRequestByIdService,
    acceptRefundRequest,
};
