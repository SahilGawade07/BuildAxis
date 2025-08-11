import { Request, Response } from "express";
import { Site } from "../../models/Site";
import { User } from "../../models/User";
import { Organisation } from "../../models/Organisation";
import { Types } from "mongoose";
import { log } from "console";

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

    const dbUser = (req as any).dbUser;

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

    if (String(dbUser.orgId) !== String(orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organisation",
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
      promoters: [...(promoters || []), dbUser._id],
      labours: labours || [],
      orgId,
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

    await User.findByIdAndUpdate(dbUser._id, {
      $push: { sites: newSite._id },
    });

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
    const dbUser = (req as any).dbUser;

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
    const orgId = req.body.orgId;
    const dbUser = (req as any).dbUser;

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

    await Organisation.updateMany(
      { sites: siteId },
      { $pull: { sites: siteId } }
    );

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
