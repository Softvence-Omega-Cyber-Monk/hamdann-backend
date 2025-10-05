import { Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrderStatusDates {
  placedAt?: Date;
  paymentProcessedAt?: Date;
  shippedAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

export interface IShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IPaymentInfo {
  cardLast4?: string;
  paymentStatus?: "pending" | "paid" | "failed";
  paymentDate?: Date;
  transactionId?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  cartId: Types.ObjectId;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentInfo?: IPaymentInfo;
  status:
    | "placed"
    | "payment_processed"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  statusDates: IOrderStatusDates;
  shippingAddress: IShippingAddress;

  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
