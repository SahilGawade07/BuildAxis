import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  try {
    console.log("🔍 Cloudinary upload attempt for:", localFilePath);
    console.log("🔍 Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
    });

    if (!localFilePath) return null;

    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      console.error("❌ File does not exist:", localFilePath);
      return null;
    }

    // Configure Cloudinary with environment variables (moved inside function)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
      api_key: process.env.CLOUDINARY_API_KEY as string,
      api_secret: process.env.CLOUDINARY_API_SECRET as string,
    });

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "buildaxis/uploads",
    });

    console.log("✅ Cloudinary upload successful:", response.url);
    fs.unlinkSync(localFilePath); // delete local file after upload

    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // cleanup in case of failure
    }

    return null;
  }
};

export { uploadOnCloudinary };
