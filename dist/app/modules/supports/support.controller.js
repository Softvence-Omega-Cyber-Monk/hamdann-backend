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
exports.SupportController = void 0;
const support_service_1 = require("./support.service");
const createSupport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, supportSubject, supportMessage } = req.body;
        if (!userId || !supportSubject || !supportMessage) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: userId, supportSubject, supportMessage"
            });
        }
        const support = yield support_service_1.SupportService.createSupport({
            userId,
            supportSubject,
            supportMessage
        });
        res.status(201).json({
            success: true,
            message: "Support ticket created successfully",
            data: support
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
const getSupport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const support = yield support_service_1.SupportService.getSupportById(req.params.id);
        if (!support) {
            return res.status(404).json({
                success: false,
                message: "Support ticket not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Support ticket fetched successfully",
            data: support
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
const getUserSupports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const supports = yield support_service_1.SupportService.getUserSupports(userId);
        res.status(200).json({
            success: true,
            message: "User support tickets fetched successfully",
            data: supports
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
const getAllSupports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supports = yield support_service_1.SupportService.getAllSupports();
        res.status(200).json({
            success: true,
            message: "All support tickets fetched successfully",
            data: supports
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
const getSupportStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield support_service_1.SupportService.getSupportStats();
        res.status(200).json({
            success: true,
            message: "Support statistics fetched successfully",
            data: stats
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
// Add this to your support.controller.ts
const createReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId, message } = req.body;
        // Validate required fields
        if (!userId || !message) {
            return res.status(400).json({
                success: false,
                message: "User ID and message are required"
            });
        }
        // Validate message is not empty
        if (message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            });
        }
        // Create the reply
        const updatedSupport = yield support_service_1.SupportService.createReply(id, { userId, message });
        if (!updatedSupport) {
            return res.status(404).json({
                success: false,
                message: "Support ticket not found"
            });
        }
        res.status(201).json({
            success: true,
            message: "Reply added successfully and email notification sent",
            data: updatedSupport
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.SupportController = {
    createSupport,
    getSupport,
    getUserSupports,
    getAllSupports,
    getSupportStats,
    createReply,
};
