import { Request, Response } from "express";
import { Site } from "../../models/Site";
import { User } from "../../models/User";
import { Organisation } from "../../models/Organisation";
import { Types } from "mongoose";

export const createSite = async (req: Request, res: Response) => {
  try {
    const {
      name,
      address,
      description,
      budget,
      startDate,
      endDate,
      status,
      supervisors,
      promoters,
      labours,
      customerName,
      orgId,
    } = req.body;

    const userId = (req as any).user?.id;

    if (
      !name ||
      !address ||
      !budget ||
      !startDate ||
      !endDate ||
      !customerName ||
      !orgId
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
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

    if (user.role !== "promoter") {
      return res.status(403).json({
        success: false,
        message: "You are not a promoter and cannot create a site",
      });
    }

    const newSite = await Site.create({
      name,
      address,
      description,
      budget,
      startDate,
      endDate,
      status: status || "active",
      supervisors: supervisors || [],
      promoters: [...(promoters || []), user._id], // 👈 Add creator to promoters
      labours: labours || [],
      customerName,
    });

    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
      return res.status(404).json({
        success: false,
        message: "Organisation not found",
      });
    }

    organisation.siteId.push(newSite._id as Types.ObjectId);
    await organisation.save();
    user.sites.push(newSite._id as Types.ObjectId);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Site created and added to organisation successfully",
      data: {
        siteId: newSite._id,
        siteName: newSite.name,
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

export const updateSite = async (req: Request, res: Response) => {
  try {
    const {
      name,
      address,
      description,
      budget,
      startDate,
      endDate,
      status,
      supervisors,
      promoters,
      labours,
      customerName,
      orgId,
    } = req.body;

    const siteId = req.params.siteId;

    if (!siteId) {
      return res.status(400).json({
        success: false,
        message: "Site ID is required",
      });
    }

    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    if (String(site.orgId) !== String(orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organisation",
      });
    }

    const userId = (req as any).user?.id;
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
        message: "You are not a promoter and cannot update a site",
      });
    }

    site.name = name || site.name;
    site.address = address || site.address;
    site.description = description || site.description;
    site.budget = budget || site.budget;
    site.startDate = startDate || site.startDate;
    site.endDate = endDate || site.endDate;
    site.status = status || site.status;
    site.supervisors = supervisors || site.supervisors;
    site.promoters = promoters || site.promoters;
    site.labours = labours || site.labours;
    site.customerName = customerName || site.customerName;

    await site.save();

    return res.status(200).json({
      success: true,
      message: "Site updated successfully",
      data: site,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteSite = async (req: Request, res: Response) => {
  try {
    const siteId = req.params.siteId;

    if (!siteId) {
      return res.status(400).json({
        success: false,
        message: "Site ID is required",
      });
    }

    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    
    if (String(site.orgId) !== String(req.body.orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organisation",
      });
    }

    const userId = (req as any).user?.id;
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
        message: "You are not a promoter and cannot delete a site",
      });
    }

    await Organisation.updateMany({ sites: siteId }, { $pull: { sites: siteId } });
    await User.updateMany({ sites: siteId }, { $pull: { sites: siteId } });

    await Site.findByIdAndDelete(siteId);

    return res.status(200).json({
      success: true,
      message: "Site deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};