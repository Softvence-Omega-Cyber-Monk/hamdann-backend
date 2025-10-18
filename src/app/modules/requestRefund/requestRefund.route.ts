import express from "express";
import { RequestRefundController } from "./requestRefund.controller";
import { uploadMultiple } from "../../utils/cloudinary";

const router = express.Router();

// Create refund request with multiple image uploads
router.post(
  "/create",
  uploadMultiple,
  RequestRefundController.createRefundRequest
);
// Get single refund request by ID
router.get(
  "/:id",
  RequestRefundController.getRefundRequestByIdController
);
// Accept refund request
router.patch(
  "/:id/accept",
  RequestRefundController.acceptRefundRequestController
);


export const RequestRefundRoutes = router;