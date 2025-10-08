import { Support } from "./support.model";
import { ISupport } from "./support.interface";
import { Types } from "mongoose";

const createSupport = async (supportData: ISupport): Promise<ISupport> => {
  try {
    const support = new Support({
      userId: new Types.ObjectId(supportData.userId),
      supportSubject: supportData.supportSubject,
      supportMessage: supportData.supportMessage,
    });

    return await support.save();
  } catch (error: any) {
    if (error.code === 11000) {
      return createSupport(supportData);
    }
    throw new Error(`Failed to create support ticket: ${error.message}`);
  }
};

const getSupportById = async (supportId: string): Promise<ISupport | null> => {
  try {
    if (!Types.ObjectId.isValid(supportId)) {
      throw new Error("Invalid support ID");
    }

    return await Support.findById(supportId).populate("userId", "name email");
  } catch (error: any) {
    throw new Error(`Failed to fetch support ticket: ${error.message}`);
  }
};

const getUserSupports = async (userId: string): Promise<ISupport[]> => {
  try {
    return await Support.find({ userId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
  } catch (error: any) {
    throw new Error(`Failed to fetch user support tickets: ${error.message}`);
  }
};

const getAllSupports = async (): Promise<ISupport[]> => {
  try {
    return await Support.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
  } catch (error: any) {
    throw new Error(`Failed to fetch all support tickets: ${error.message}`);
  }
};

// Get support statistics
const getSupportStats = async (): Promise<{
  pending: number;
  todayNewReports: number;
  resolvedTickets: number;
}> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateFilter = {
      createdAt: { $gte: today, $lt: tomorrow },
    };

    const [pending, resolved, todayTotal] = await Promise.all([
      Support.countDocuments({ status: "Pending" }),
      Support.countDocuments({ status: "Resolved" }),
      Support.countDocuments(dateFilter),
    ]);

    return {
      pending: pending,
      todayNewReports: todayTotal, // Total tickets created today
      resolvedTickets: resolved,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch support statistics: ${error.message}`);
  }
};

export const SupportService = {
  createSupport,
  getSupportById,
  getUserSupports,
  getAllSupports,
  getSupportStats,
};
