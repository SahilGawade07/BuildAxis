import {
  v2 as cloudinary,
  UploadApiResponse,
  DeleteApiResponse,
} from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      return null;
    }

    // Configure Cloudinary with environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
      api_key: process.env.CLOUDINARY_API_KEY as string,
      api_secret: process.env.CLOUDINARY_API_SECRET as string,
    });

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "buildaxis/uploads",
    });

    fs.unlinkSync(localFilePath); // delete local file after upload

    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // cleanup in case of failure
    }

    return null;
  }
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (
  imageUrl: string
): Promise<DeleteApiResponse | null> => {
  try {
    if (!imageUrl) return null;

    // Configure Cloudinary with environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
      api_key: process.env.CLOUDINARY_API_KEY as string,
      api_secret: process.env.CLOUDINARY_API_SECRET as string,
    });

    // Extract public ID from Cloudinary URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (!publicId) {
      console.log("Could not extract public ID from URL:", imageUrl);
      return null;
    }

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

// Function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (imageUrl: string): string | null => {
  try {
    // Handle different Cloudinary URL formats
    // Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      return null;
    }

    // Skip version number if present (v1234567890)
    let publicIdStartIndex = uploadIndex + 1;
    if (urlParts[publicIdStartIndex]?.startsWith("v")) {
      publicIdStartIndex++;
    }

    // Get the public ID (everything after upload/version)
    const publicIdParts = urlParts.slice(publicIdStartIndex);
    const publicId = publicIdParts.join("/");

    // Remove file extension
    const publicIdWithoutExtension = publicId.replace(/\.[^/.]+$/, "");

    return publicIdWithoutExtension;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, extractPublicIdFromUrl };
