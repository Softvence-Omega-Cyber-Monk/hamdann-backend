import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { configs } from "../configs";

// Function to delete a file from the local filesystem
export const deleteFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (err: any) {
    console.error(`Error deleting file: ${err.message}`);
  }
};

// Function to upload an image to Cloudinary
export const uploadImgToCloudinary = async (
  name: string,
  filePath: string,
  folder: string
) => {
  cloudinary.config({
    cloud_name: configs.cloudinary.cloud_name,
    api_key: configs.cloudinary.cloud_api_key,
    api_secret: configs.cloudinary.cloud_api_secret,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      timeout: 60000, // 60 seconds timeout
      public_id: name,
    });

    return uploadResult;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  } finally {
    // ✅ Always clean up local file (success or fail)
    await deleteFile(filePath);
  }
};

// Function to handle multiple image uploads with auto-generated names
export const uploadMultipleImages = async (
  filePaths: string[],
  folder: string
) => {
  try {
    const imageUrls: string[] = [];

    for (const filePath of filePaths) {
      // Generate a unique name for each image
      const imageName = `${Math.floor(
        100 + Math.random() * 900
      )}-${Date.now()}`;

      const uploadResult = await uploadImgToCloudinary(
        imageName,
        filePath,
        folder
      );
      imageUrls.push(uploadResult.secure_url);
    }

    return imageUrls;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("Multiple image upload failed");
  }
};

export const deleteImageFromCloudinary = async (publicId: string) => {
  cloudinary.config({
    cloud_name: configs.cloudinary.cloud_name,
    api_key: configs.cloudinary.cloud_api_key,
    api_secret: configs.cloudinary.cloud_api_secret,
  });

  console.log("Deleting image from Cloudinary with public ID:", publicId);
  try {
    // Delete the image from Cloudinary using its public ID
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Image deletion failed");
  }
};

// Multer storage configuration for local file saving
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads")); // Define folder for temporary file storage
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    //cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    cb(null, file.fieldname + "-" + uniqueSuffix); // Generate unique file name
  },
});

// Multer upload setup
export const upload = multer({ storage: storage });
export const uploadMultiple = upload.array("images", 30);

export const Multiupload = multer({ storage }).fields([
  { name: "photo1", maxCount: 1 },
  { name: "photo2", maxCount: 1 }, // optional
]);
