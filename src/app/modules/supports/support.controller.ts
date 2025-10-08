import { Request, Response } from "express";
import { SupportService } from "./support.service";

const createSupport = async (req: Request, res: Response) => {
  try {
    const { userId, supportSubject, supportMessage } = req.body;

    if (!userId || !supportSubject || !supportMessage) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: userId, supportSubject, supportMessage"
      });
    }

    const support = await SupportService.createSupport({
      userId,
      supportSubject,
      supportMessage
    });

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      data: support
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getSupport = async (req: Request, res: Response) => {
  try {
    const support = await SupportService.getSupportById(req.params.id);
    
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserSupports = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const supports = await SupportService.getUserSupports(userId);
    
    res.status(200).json({
      success: true,
      message: "User support tickets fetched successfully",
      data: supports
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllSupports = async (req: Request, res: Response) => {
  try {
    const supports = await SupportService.getAllSupports();
    
    res.status(200).json({
      success: true,
      message: "All support tickets fetched successfully",
      data: supports
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getSupportStats = async (req: Request, res: Response) => {
  try {
    const stats = await SupportService.getSupportStats();
    
    res.status(200).json({
      success: true,
      message: "Support statistics fetched successfully",
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const SupportController = {
  createSupport,
  getSupport,
  getUserSupports,
  getAllSupports,
  getSupportStats,
};