import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "buildaxis/uploads",
    });

    fs.unlinkSync(localFilePath); // delete local file after upload

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // cleanup in case of failure
    }

    return null;
  }
};

export { uploadOnCloudinary };
