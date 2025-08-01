import { Request, Response } from "express";
import { Organisation } from "../../models/Organisation";
import { User } from "../../models/User";
import { Site } from "../../models/Site";
import { Labour } from "../../models/Labour";
import { Types } from "mongoose";

export const createOrganisation = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, logoUrl } = req.body;
    const userId = (req as any).user?.id;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "promoter") {
      return res.status(403).json({
        success: false,
        message: "Only promoters can create organisations",
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
      logoUrl,
      promoters: [userId],
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
    const userId = (req as any).user?.id;

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
      organisation.promoters.includes(userId as Types.ObjectId) ||
      organisation.supervisorsId.includes(userId as Types.ObjectId);

    if (hasAccess) {
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
    const { name, email, phone, logoUrl } = req.body;
    const userId = (req as any).user?.id;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organisation ID is required",
      });
    }

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
        message: "Only promoters can update organisation details",
      });
    }

    const updatedOrganisation = await Organisation.findByIdAndUpdate(
      orgId,
      {
        name: name || organisation.name,
        email: email || organisation.email,
        phone: phone || organisation.phone,
        logoUrl: logoUrl || organisation.logoUrl,
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
    const userId = (req as any).user?.id;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organisation ID is required",
      });
    }

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
        message: "Only promoters can delete organisation",
      });
    }

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
    const { orgId, supervisorPhone } = req.body;
    const userId = (req as any).user?.id;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organisation ID is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(user.orgId);
    console.log(orgId);
    if (String(user.orgId) !== String(orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organisation",
      });
    }

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
    const { fName, lName, email, phone, password, profilePic, orgId } =
      req.body;
    const userId = (req as any).user?.id;

    if (!fName || !lName || !email || !phone || !password || !orgId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Fetch the complete user data from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has access to this organisation
    console.log(user.orgId);
    console.log(orgId);
    if (String(user.orgId) !== String(orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organisation",
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

    // Create new supervisor
    const newSupervisor = await User.create({
      fName,
      lName,
      email,
      phone,
      password,
      role: "supervisor",
      profilePic:
        profilePic ||
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      orgId: orgId as Types.ObjectId,
    });

    // Add supervisor to organisation
    const organisation = await Organisation.findById(orgId as Types.ObjectId);
    console.log(organisation);

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
    const { orgId, labourPhone } = req.body;
    const userId = (req as any).user?.id;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organisation ID is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(user.orgId);
    console.log(orgId);
    if (String(user.orgId) !== String(orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organisation",
      });
    }

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

    organisation.supervisorsId.push(labour._id as Types.ObjectId);
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
    const { fName, lName, phone, profilePic, orgId, documentsUrl, work } =
      req.body;
    const userId = (req as any).user?.id;

    if (
      !fName ||
      !lName ||
      !phone ||
      !orgId ||
      !profilePic ||
      !documentsUrl ||
      !work
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (String(user.orgId) !== String(orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organisation",
      });
    }

    const existingLabour = await Labour.findOne({ $or: [{ phone }] });

    if (existingLabour) {
      return res.status(400).json({
        success: false,
        message: "User with this phone already exists",
      });
    }

    const newLabour = await Labour.create({
      fName,
      lName,
      phone,
      profilePic:
        profilePic ||
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      orgId: orgId as Types.ObjectId,
      work,
      documentsUrl,
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
