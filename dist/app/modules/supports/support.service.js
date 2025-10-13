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
exports.SupportService = void 0;
const support_model_1 = require("./support.model");
const mail_sender_1 = require("../../utils/mail_sender");
const user_schema_1 = require("../user/user.schema");
const mongoose_1 = require("mongoose");
const createSupport = (supportData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const support = new support_model_1.Support({
            userId: new mongoose_1.Types.ObjectId(supportData.userId),
            supportSubject: supportData.supportSubject,
            supportMessage: supportData.supportMessage,
        });
        return yield support.save();
    }
    catch (error) {
        if (error.code === 11000) {
            return createSupport(supportData);
        }
        throw new Error(`Failed to create support ticket: ${error.message}`);
    }
});
const getSupportById = (supportId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.Types.ObjectId.isValid(supportId)) {
            throw new Error("Invalid support ID");
        }
        return yield support_model_1.Support.findById(supportId).populate("userId", "name email");
    }
    catch (error) {
        throw new Error(`Failed to fetch support ticket: ${error.message}`);
    }
});
const getUserSupports = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield support_model_1.Support.find({ userId })
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
    }
    catch (error) {
        throw new Error(`Failed to fetch user support tickets: ${error.message}`);
    }
});
const getAllSupports = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield support_model_1.Support.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
    }
    catch (error) {
        throw new Error(`Failed to fetch all support tickets: ${error.message}`);
    }
});
// Get support statistics
const getSupportStats = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateFilter = {
            createdAt: { $gte: today, $lt: tomorrow },
        };
        const [pending, resolved, todayTotal] = yield Promise.all([
            support_model_1.Support.countDocuments({ status: "Pending" }),
            support_model_1.Support.countDocuments({ status: "Resolved" }),
            support_model_1.Support.countDocuments(dateFilter),
        ]);
        return {
            pending: pending,
            todayNewReports: todayTotal, // Total tickets created today
            resolvedTickets: resolved,
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch support statistics: ${error.message}`);
    }
});
// Create reply to support ticket
const createReply = (supportId, replyData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.Types.ObjectId.isValid(supportId)) {
            throw new Error("Invalid support ID");
        }
        if (!replyData.userId || !replyData.message) {
            throw new Error("User ID and message are required");
        }
        if (replyData.message.trim().length === 0) {
            throw new Error("Message cannot be empty");
        }
        // Create the reply object
        const newReply = {
            userId: new mongoose_1.Types.ObjectId(replyData.userId),
            message: replyData.message.trim(),
        };
        // Add reply to the support ticket
        const updatedSupport = yield support_model_1.Support.findByIdAndUpdate(supportId, {
            $push: { replies: newReply },
            $set: { status: 'Pending' } // Set back to Pending when there's a new reply
        }, { new: true })
            .populate("userId", "name email")
            .populate("replies.userId", "name email role");
        if (!updatedSupport) {
            throw new Error("Support ticket not found");
        }
        // Check if ticketId exists and provide a fallback
        const ticketId = updatedSupport.ticketId || 'Unknown Ticket ID';
        // Get the user who created the reply
        const replyUser = yield user_schema_1.User_Model.findById(replyData.userId).select("name email role");
        // Send email notification to the original ticket creator
        if (updatedSupport.userId && replyUser) {
            const ticketUser = updatedSupport.userId;
            yield (0, mail_sender_1.sendSupportReplyEmail)(ticketUser.email, ticketUser.name, ticketId, // Use the checked ticketId
            updatedSupport.supportSubject, replyData.message, replyUser.role === 'Admin' ? 'Support Team' : replyUser.name);
        }
        return updatedSupport;
    }
    catch (error) {
        throw new Error(`Failed to create reply: ${error.message}`);
    }
});
exports.SupportService = {
    createSupport,
    getSupportById,
    getUserSupports,
    getAllSupports,
    getSupportStats,
    createReply,
};
