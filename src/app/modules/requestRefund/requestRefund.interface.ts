import { Types } from "mongoose";

export interface IrequestRefund {
  orderId: Types.ObjectId;
  refundReason: string;
  describeIssue: string;
  productImage: string[];
  preferredResolution: "Refund Amount" | "Replacement";
  isAccepted: boolean;
}
