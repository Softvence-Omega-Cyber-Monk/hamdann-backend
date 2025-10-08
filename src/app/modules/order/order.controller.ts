import { Request, Response } from "express";
import { OrderService } from "./order.service";

// Create Order
 const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await OrderService.createOrder(req.body);
    res.status(201).json({ success: true, data: {
      orderId: order._id,
      status: order.status,
      items: order.items,
    } });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All Orders
 const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Order
 const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order
 const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await OrderService.updateOrder(req.params.id, req.body);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


 const getCurrentOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await OrderService.getCurrentOrdersService(userId);
    res.status(200).json({
      success: true,
      message: "Current orders fetched successfully",
      data: result,
    });
  } catch (error : any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch current orders",
    });
  }
};

// 🟣 Get previous orders
 const getPreviousOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await OrderService.getPreviousOrdersService(userId);
    res.status(200).json({
      success: true,
      message: "Previous orders fetched successfully",
      data: result,
    });
  } catch (error : any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch previous orders",
    });
  }
};


export const OrderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  getCurrentOrders,
  getPreviousOrders,
};