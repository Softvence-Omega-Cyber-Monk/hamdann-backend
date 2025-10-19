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
exports.RequestRefundController = void 0;
const mongoose_1 = require("mongoose");
const requestRefund_service_1 = require("./requestRefund.service");
const createRefundRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, refundReason, describeIssue, preferredResolution } = req.body;
        if (!orderId || !refundReason || !describeIssue || !preferredResolution) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: orderId, refundReason, describeIssue, preferredResolution",
            });
        }
        if (!["Refund Amount", "Replacement"].includes(preferredResolution)) {
            return res.status(400).json({
                success: false,
                message: "preferredResolution must be either 'Refund Amount' or 'Replacement'",
            });
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required",
            });
        }
        if (orderId.status === "return_requested") {
            return res.status(400).json({
                success: false,
                message: "This request is already submitted for refund ",
            });
        }
        const refundData = {
            orderId: new mongoose_1.Types.ObjectId(orderId),
            refundReason,
            describeIssue,
            productImage: [],
            preferredResolution: preferredResolution,
            isAccepted: false
        };
        const refundRequest = yield requestRefund_service_1.RequestRefundService.createRefundRequest(refundData, req.files);
        res.status(201).json({
            success: true,
            message: "Refund request created successfully",
            data: refundRequest,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
const getRefundRequestByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const refundRequest = yield requestRefund_service_1.RequestRefundService.getRefundRequestByIdService(id);
        if (!refundRequest) {
            return res.status(404).json({
                success: false,
                message: "Refund request not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Refund request retrieved successfully",
            data: refundRequest,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
const acceptRefundRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const acceptedRefundRequest = yield requestRefund_service_1.RequestRefundService.acceptRefundRequest(id);
        res.status(200).json({
            success: true,
            message: "Refund request accepted successfully",
            data: acceptedRefundRequest,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.RequestRefundController = {
    createRefundRequest,
    getRefundRequestByIdController,
    acceptRefundRequestController,
};
