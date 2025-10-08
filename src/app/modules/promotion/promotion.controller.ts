import { Request, Response } from "express";
import {
  CreatePromotionSchema,
  UpdatePromotionSchema,
} from "./promotion.validation";
import {
  createPromotionService,
  getPromotionService,
  getAllPromotionsService,
  updatePromotionService,
} from "./promotion.service";
import { PromotionModel } from "./promotion.model";
import { IPromotion } from "./promotion.interface";
import { v2 as cloudinary } from "cloudinary";
import { configs } from "../../configs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: configs.cloudinary.cloud_name,
  api_key: configs.cloudinary.cloud_api_key,
  api_secret: configs.cloudinary.cloud_api_secret,
});

export const createPromotion = async (req: Request, res: Response) => {
  try {
    // Validate form-data
    const validatedData = CreatePromotionSchema.parse(req.body);

    let imageUrl = "";

    // Only upload if a file exists
    if (req.file?.buffer) {
      // console.log("Buffer", req.file?.buffer);
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "promotions" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file?.buffer);
      });

      imageUrl = result.secure_url;
    }

    // Prepare data to save
    const dataToSave: IPromotion = {
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      promotionImage: imageUrl,
    };

    // Call service to create promotion
    const promotion = await createPromotionService(dataToSave);

    // console.log("Save data", promotion)

    res.status(201).json({ success: true, data: promotion });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get single promotion
export const getPromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const promotion = await getPromotionService(id);

    res.status(200).json({ success: true, data: promotion });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get all promotions
export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    console.log("Route hit");
    const promotion = await getAllPromotionsService();
    res.status(200).json({ success: true, data: promotion });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Promotion
export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate incoming data
    const validatedData = UpdatePromotionSchema.parse(req.body);

    let imageUrl: string | undefined;

    // Upload new image if provided
    if (req.file && req.file?.buffer) {
      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "promotions" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file?.buffer);
      });

      imageUrl = result.secure_url;
    }

    // Prepare update data — safely converting strings to Date
    const dataToUpdate: any = {
      ...validatedData,
      ...(validatedData.startDate && {
        startDate: new Date(validatedData.startDate as string),
      }),
      ...(validatedData.endDate && {
        endDate: new Date(validatedData.endDate as string),
      }),
      ...(imageUrl && { promotionImage: imageUrl }),
    };

    const updatedPromotion = await updatePromotionService(id, dataToUpdate);

    res.status(200).json({
      success: true,
      message: "Promotion updated successfully",
      data: updatedPromotion,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Pause Promotion
export const pausePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedPromotion = await updatePromotionService(id, {
      isActive: false,
    });

    res.status(200).json({
      success: true,
      message: "Promotion paused successfully",
      data: updatedPromotion,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
