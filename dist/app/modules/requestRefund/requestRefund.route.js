"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRefundRoutes = void 0;
const express_1 = __importDefault(require("express"));
const requestRefund_controller_1 = require("./requestRefund.controller");
const cloudinary_1 = require("../../utils/cloudinary");
const router = express_1.default.Router();
// Create refund request with multiple image uploads
router.post("/create", cloudinary_1.uploadMultiple, requestRefund_controller_1.RequestRefundController.createRefundRequest);
// Get single refund request by ID
router.get("/:id", requestRefund_controller_1.RequestRefundController.getRefundRequestByIdController);
// Accept refund request
router.patch("/:id/accept", requestRefund_controller_1.RequestRefundController.acceptRefundRequestController);
exports.RequestRefundRoutes = router;
