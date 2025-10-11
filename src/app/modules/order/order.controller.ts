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

// Add this to your existing order.controller.ts

const getUserOrderStatistics = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    const statistics = await OrderService.getUserOrderStatistics(userId);
    
    res.status(200).json({
      success: true,
      message: "Order statistics fetched successfully",
      data: statistics
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order statistics"
    });
  }
};

const getAdminStatistics = async (req: Request, res: Response) => {
  try {
    const statistics = await OrderService.getAdminStatisticsService();

    res.status(200).json({
      success: true,
      message: "Admin statistics retrieved successfully",
      data: statistics
    });
  } catch (error) {
    console.error("Error in getAdminStatistics controller:", error);
    
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

const getOrderStatusCounts = async (req: Request, res: Response) => {
  try {
    const statusCounts = await OrderService.getOrderStatusCountsService();

    res.status(200).json({
      success: true,
      message: "Order status counts retrieved successfully",
      data: statusCounts
    });
  } catch (error) {
    console.error("Error in getOrderStatusCounts controller:", error);
    
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

const getOrderStatusSummary = async (req: Request, res: Response) => {
  try {
    const statusSummary = await OrderService.getOrderStatusSummaryService();

    res.status(200).json({
      success: true,
      message: "Order status summary retrieved successfully",
      data: statusSummary
    });
  } catch (error: any) {
    console.error("Error in getOrderStatusSummary controller:", error);
    
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
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
  getUserOrderStatistics,
  getAdminStatistics,
  getOrderStatusCounts,
  getOrderStatusSummary,
};