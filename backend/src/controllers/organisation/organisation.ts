import { Request, Response, NextFunction } from "express";
import { Organisation } from "../../models/Organisation";
import { User } from "../../models/User";
import { Site } from "../../models/Site";
import { Labour } from "../../models/Labour";
import { Types } from "mongoose";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary";
import fs from "fs";

// Middleware for organization access control (from params or body)
export const checkOrgAccessFromParams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).dbUser;
    const orgId = req.params.orgId || req.body.orgId;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organisation ID is required",
      });
    }

    if (String(user.orgId) !== String(orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organisation",
      });
    }

    (req as any).orgId = orgId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Middleware to check if user is a promoter
export const checkPromoterAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgId = req.params.orgId;
    const userId = (req as any).dbUser._id;

    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
      return res.status(404).json({
        success: false,
        message: "Organisation not found",
      });
    }

    if (!organisation.promoters.includes(userId as Types.ObjectId)) {
      return res.status(403).json({
        success: false,
        message: "Only promoters can perform this action",
      });
    }

    (req as any).organisation = organisation;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createOrganisation = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, logoUrl } = req.body;
    const user = (req as any).dbUser;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and address are required",
      });
    }

    const existingOrg = await Organisation.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: "Organisation with this email or phone already exists",
      });
    }

    const newOrganisation = await Organisation.create({
      name,
      email,
      phone,
      address,
      logoUrl,
      promoters: [user._id],
      supervisorsId: [],
      labourId: [],
      siteId: [],
    });

    user.orgId = newOrganisation._id as Types.ObjectId;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Organisation created successfully",
      data: {
        id: newOrganisation._id,
        name: newOrganisation.name,
        email: newOrganisation.email,
        phone: newOrganisation.phone,
        address: newOrganisation.address,
        logoUrl: newOrganisation.logoUrl,
        promoters: newOrganisation.promoters,
        supervisorsId: newOrganisation.supervisorsId,
        createdAt: newOrganisation.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getOrganisation = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const userId = (req as any).dbUser._id;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organisation ID is required",
      });
    }

    const organisation = await Organisation.findById(orgId)
      .populate("promoters", "fName lName email phone")
      .populate("supervisorsId", "fName lName email phone")
      .populate("labourId", "fName lName phone")
      .populate("siteId", "name location");

    if (!organisation) {
      return res.status(404).json({
        success: false,
        message: "Organisation not found",
      });
    }

    const hasAccess =
      organisation.promoters.some((p) => p._id.equals(userId)) ||
      organisation.supervisorsId.some((s) => s._id.equals(userId));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this organisation",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Organisation retrieved successfully",
      data: organisation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateOrganisation = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const { name, email, phone, address, logoUrl: logoUrlFromBody } = req.body;
    const organisation = (req as any).organisation;

    // Handle logo file upload if present
    let logoUrl = organisation.logoUrl; // Keep existing logo by default

    // Check if logo should be removed (explicitly set to null/empty)
    if (logoUrlFromBody === null || logoUrlFromBody === "") {
      if (
        organisation.logoUrl &&
        organisation.logoUrl.includes("cloudinary.com")
      ) {
        console.log(
          "🗑️ Removing logo as requested, deleting from Cloudinary:",
          organisation.logoUrl
        );
        const deleteResult = await deleteFromCloudinary(organisation.logoUrl);
        if (deleteResult) {
          console.log("✅ Logo deleted successfully from Cloudinary");
        } else {
          console.log(
            "⚠️ Failed to delete logo from Cloudinary, but continuing"
          );
        }
      }
      logoUrl = ""; // Set logo to empty string
    } else if (logoUrlFromBody && logoUrlFromBody !== organisation.logoUrl) {
      // New logo URL provided in body (not as file upload)
      if (
        organisation.logoUrl &&
        organisation.logoUrl.includes("cloudinary.com")
      ) {
        console.log(
          "🗑️ Updating logo URL, deleting old logo from Cloudinary:",
          organisation.logoUrl
        );
        const deleteResult = await deleteFromCloudinary(organisation.logoUrl);
        if (deleteResult) {
          console.log("✅ Old logo deleted successfully from Cloudinary");
        } else {
          console.log(
            "⚠️ Failed to delete old logo from Cloudinary, but continuing"
          );
        }
      }
      logoUrl = logoUrlFromBody;
    } else if (req.file) {
      try {
        // Delete previous logo from Cloudinary if it exists
        if (
          organisation.logoUrl &&
          organisation.logoUrl.includes("cloudinary.com")
        ) {
          console.log(
            "🗑️ Deleting previous logo from Cloudinary:",
            organisation.logoUrl
          );
          const deleteResult = await deleteFromCloudinary(organisation.logoUrl);
          if (deleteResult) {
            console.log("✅ Previous logo deleted successfully");
          } else {
            console.log(
              "⚠️ Failed to delete previous logo, but continuing with upload"
            );
          }
        } else if (organisation.logoUrl) {
          console.log(
            "ℹ️ Previous logo is not from Cloudinary, skipping deletion:",
            organisation.logoUrl
          );
        }

        // Upload new logo to Cloudinary
        console.log("📤 Uploading new logo to Cloudinary");
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (cloudinaryResponse) {
          logoUrl = cloudinaryResponse.secure_url;
          console.log("✅ New logo uploaded successfully:", logoUrl);
        } else {
          return res.status(500).json({
            success: false,
            message: "Failed to upload logo",
          });
        }
      } catch (uploadError) {
        console.error("❌ Logo upload/delete error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Logo upload failed",
          error:
            uploadError instanceof Error
              ? uploadError.message
              : "Unknown upload error",
        });
      }
    }

    const updatedOrganisation = await Organisation.findByIdAndUpdate(
      orgId,
      {
        name: name || organisation.name,
        email: email || organisation.email,
        phone: phone || organisation.phone,
        address: address || organisation.address,
        logoUrl: logoUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Organisation updated successfully",
      data: updatedOrganisation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteOrganisation = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;

    const sitesToDelete = await Site.find({ organisationId: orgId });
    const siteIds = sitesToDelete.map((site) => site._id);

    await User.updateMany(
      { orgId: orgId },
      {
        $unset: { orgId: 1 },
        $set: { refreshToken: "" },
      }
    );

    if (siteIds.length > 0) {
      await User.updateMany(
        { sites: { $in: siteIds } },
        { $pull: { sites: { $in: siteIds } } }
      );
    }

    await Site.deleteMany({ organisationId: orgId });
    await Labour.deleteMany({ organisationId: orgId });
    await Organisation.findByIdAndDelete(orgId);

    return res.status(200).json({
      success: true,
      message: "Organisation deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const addSupervisor = async (req: Request, res: Response) => {
  try {
    const { supervisorPhone } = req.body;
    const orgId = (req as any).orgId;

    // Check if supervisor exists in the app
    const supervisor = await User.findOne({
      phone: supervisorPhone,
      role: "supervisor",
    });

    if (!supervisor) {
      return res.status(200).json({
        success: false,
        message: "Supervisor not found in the app",
        action: "CREATE_SUPERVISOR",
        data: {
          phone: supervisorPhone,
          organisationId: orgId,
        },
      });
    }

    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
      return res.status(404).json({
        success: false,
        message: "Organisation not found",
      });
    }

    if (organisation.supervisorsId.includes(supervisor._id as Types.ObjectId)) {
      return res.status(400).json({
        success: false,
        message: "Supervisor is already added to this organisation",
      });
    }

    organisation.supervisorsId.push(supervisor._id as Types.ObjectId);
    await organisation.save();

    supervisor.orgId = orgId as Types.ObjectId;
    await supervisor.save();

    return res.status(200).json({
      success: true,
      message: "Supervisor added successfully",
      action: "SUPERVISOR_ADDED",
      data: {
        supervisorId: supervisor._id,
        supervisorName: `${supervisor.fName} ${supervisor.lName}`,
        supervisorPhone: supervisor.phone,
        organisationId: orgId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createSupervisor = async (req: Request, res: Response) => {
  try {
    const { fName, lName, email, phone, password } = req.body;
    const user = (req as any).dbUser;

    // Get orgId from the authenticated user's context
    const orgId = user.orgId;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "User is not associated with any organisation",
      });
    }

    if (!fName || !lName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if supervisor already exists
    const existingSupervisor = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingSupervisor) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    // ✅ Handle file upload (multer stores file locally first)
    let profilePicUrl: string =
      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"; // fallback

    if (req.file) {
      console.log("📁 File received:", {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });

      try {
        const uploadResult = await uploadOnCloudinary(req.file.path);

        if (uploadResult?.url) {
          profilePicUrl = uploadResult.url;
          console.log("✅ Profile pic uploaded to Cloudinary:", profilePicUrl);
        } else {
          console.log("⚠️ Cloudinary upload failed, using fallback URL");
        }
      } catch (uploadError) {
        console.error("❌ File upload error:", uploadError);
        // Continue with default profile pic
      }
    } else {
      console.log("📁 No file received in request");
    }

    // Create new supervisor
    const newSupervisor = await User.create({
      fName,
      lName,
      email,
      phone,
      password,
      role: "supervisor",
      profilePic: profilePicUrl,
      orgId: orgId as Types.ObjectId,
    });

    // Add supervisor to organisation
    const organisation = await Organisation.findById(orgId as Types.ObjectId);

    if (!organisation) {
      return res.status(404).json({
        success: false,
        message: "Organisation not found",
      });
    }

    organisation.supervisorsId.push(newSupervisor._id as Types.ObjectId);
    await organisation.save();

    return res.status(201).json({
      success: true,
      message: "Supervisor created and added to organisation successfully",
      action: "SUPERVISOR_CREATED",
      data: {
        supervisorId: newSupervisor._id,
        supervisorName: `${newSupervisor.fName} ${newSupervisor.lName}`,
        supervisorEmail: newSupervisor.email,
        supervisorPhone: newSupervisor.phone,
        supervisorPic: newSupervisor.profilePic,
        organisationId: orgId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const addLabour = async (req: Request, res: Response) => {
  try {
    const { labourPhone } = req.body;
    const orgId = (req as any).orgId;

    const labour = await Labour.findOne({
      phone: labourPhone,
    });

    if (!labour) {
      return res.status(200).json({
        success: false,
        message: "Labour not found in the app",
        action: "CREATE_LABOUR",
        data: {
          phone: labourPhone,
          organisationId: orgId,
        },
      });
    }

    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
      return res.status(404).json({
        success: false,
        message: "Organisation not found",
      });
    }

    if (organisation.labourId.includes(labour._id as Types.ObjectId)) {
      return res.status(400).json({
        success: false,
        message: "Labour is already added to this organisation",
      });
    }

    // Fixed: should be labourId, not supervisorsId
    organisation.labourId.push(labour._id as Types.ObjectId);
    await organisation.save();

    labour.orgId = orgId as Types.ObjectId;
    await labour.save();

    return res.status(200).json({
      success: true,
      message: "Labour added successfully",
      action: "LABOUR_ADDED",
      data: {
        labourId: labour._id,
        labourName: `${labour.fName} ${labour.lName}`,
        labourPhone: labour.phone,
        organisationId: orgId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createLabour = async (req: Request, res: Response) => {
  try {
    const { fName, lName, phone, work } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const profilePic = files?.profilePic?.[0]; // Get profile pic file
    const documents = files?.documentsUrl || []; // Get document files
    const user = (req as any).dbUser;

    // Get orgId from the authenticated user's context
    const orgId = user.orgId;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "User is not associated with any organisation",
      });
    }

    if (!fName) {
      return res.status(400).json({
        success: false,
        message: "First name is required",
      });
    }

    if (!lName) {
      return res.status(400).json({
        success: false,
        message: "Last name is required",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Validate phone number format
    const phoneNumber = parseInt(phone);
    if (isNaN(phoneNumber) || phoneNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    // Upload profile picture to Cloudinary
    let profilePicUrl: string =
      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"; // fallback

    try {
      const uploadResult = await uploadOnCloudinary(profilePic.path);
      if (uploadResult?.url) {
        profilePicUrl = uploadResult.url;
      }
    } catch (uploadError) {
      // Continue with default profile pic
    }

    // documentsUrl is optional, so we don't need to validate it
    // if (!documentsUrl) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Documents URL is required",
    //   });
    // }

    if (!work) {
      return res.status(400).json({
        success: false,
        message: "Work details are required",
      });
    }
    const existingLabour = await Labour.findOne({ phone: phoneNumber });

    if (existingLabour) {
      return res.status(400).json({
        success: false,
        message: "User with this phone already exists",
      });
    }

    // Upload documents to Cloudinary
    const documentsUrl: string[] = [];
    if (documents.length > 0) {
      for (const doc of documents) {
        try {
          const uploadResult = await uploadOnCloudinary(doc.path);
          if (uploadResult?.url) {
            documentsUrl.push(uploadResult.url);
          }
        } catch (uploadError) {
          // Continue with other documents
        }
      }
    }

    const newLabour = await Labour.create({
      fName,
      lName,
      phone: phoneNumber, // Use validated phone number
      profilePic: profilePicUrl,
      orgId: orgId as Types.ObjectId,
      work,
      documentsUrl: documentsUrl,
    });

    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
      return res.status(404).json({
        success: false,
        message: "Organisation not found",
      });
    }

    organisation.labourId.push(newLabour._id as Types.ObjectId);
    await organisation.save();

    // Clean up temporary local files
    try {
      if (profilePic && profilePic.path) {
        fs.unlinkSync(profilePic.path);
      }

      documents.forEach((doc) => {
        try {
          fs.unlinkSync(doc.path);
        } catch (cleanupError) {
          // Continue with cleanup
        }
      });
    } catch (cleanupError) {
      // Continue with response
    }

    return res.status(201).json({
      success: true,
      message: "Labour created and added to organisation successfully",
      data: {
        labourId: newLabour._id,
        labourName: `${newLabour.fName} ${newLabour.lName}`,
        labourPhone: newLabour.phone,
        organisationId: orgId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
