import { Types } from "mongoose";
import { RequestRefund } from "./requestRefund.model";
import { IrequestRefund } from "./requestRefund.interface";
import { Order } from "../order/order.model";
import { uploadMultipleImages } from "../../utils/cloudinary";

const createRefundRequest = async (
  refundData: IrequestRefund,
  productImageFiles?: Express.Multer.File[]
): Promise<IrequestRefund> => {
  try {
    // Validate if order exists
    const orderExists = await Order.findById(refundData.orderId);
    if (!orderExists) {
      throw new Error("Order not found");
    }

    // Check if refund request already exists for this order
    const existingRefund = await RequestRefund.findOne({
      orderId: refundData.orderId,
    });

    if (existingRefund) {
      throw new Error("Refund request already exists for this order");
    }

    // Upload multiple product images to Cloudinary if files exist
    if (productImageFiles && productImageFiles.length > 0) {
      const filePaths = productImageFiles.map((file) => file.path);
      const imageUrls = await uploadMultipleImages(
        filePaths,
        "refund-requests"
      );
      refundData.productImage = imageUrls;
    } else {
      throw new Error("At least one product image is required");
    }

    // Create refund request
    const refundRequest = await RequestRefund.create(refundData);

    await Order.findByIdAndUpdate(
      refundData.orderId,
      {
        status: "return_requested",
        "statusDates.returnRequestedAt": new Date(),
        $set: {
          // Keep existing status dates, only update returnRequestedAt
          "statusDates.returnRequestedAt": new Date(),
        },
      },
      { new: true }
    );

    return refundRequest;
  } catch (error: any) {
    throw new Error(`Failed to create refund request: ${error.message}`);
  }
};

const getRefundRequestByIdService = async (
  refundId: string
): Promise<IrequestRefund | null> => {
  if (!Types.ObjectId.isValid(refundId)) {
    throw new Error("Invalid refund request ID");
  }

  try {
    const refundRequest = await RequestRefund.findById(refundId)
      .populate({
        path: "orderId",
        select: "orderNumber totalAmount status statusDates userId items",
        populate: {
          path: "userId",
          select: "name email"
        }
      });

    return refundRequest;
  } catch (error: any) {
    throw new Error(`Failed to fetch refund request: ${error.message}`);
  }
};
const acceptRefundRequest = async (
  refundId: string
): Promise<IrequestRefund | null> => {
  if (!Types.ObjectId.isValid(refundId)) {
    throw new Error("Invalid refund request ID");
  }

  try {
    // Find the refund request first
    const refundRequest = await RequestRefund.findById(refundId);
    if (!refundRequest) {
      throw new Error("Refund request not found");
    }

    // Check if already accepted
    if (refundRequest.isAccepted) {
      throw new Error("Refund request is already accepted");
    }

    // Update isAccepted to true
    const updatedRefundRequest = await RequestRefund.findByIdAndUpdate(
      refundId,
      {
        $set: {
          isAccepted: true
        }
      },
      { new: true }
    ).populate({
      path: "orderId",
      select: "orderNumber totalAmount status statusDates userId items",
      populate: {
        path: "userId",
        select: "name email"
      }
    });

    return updatedRefundRequest;
  } catch (error: any) {
    throw new Error(`Failed to accept refund request: ${error.message}`);
  }
};

export const RequestRefundService = {
  createRefundRequest,
  getRefundRequestByIdService,
  acceptRefundRequest,
};
