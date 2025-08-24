import { Request, Response } from "express";
import { Site } from "../../models/Site";

export const getsites = async (req: Request, res: Response) => {
  const { orgId } = req.params;

  try {
    const sites = await Site.find({ orgId }).select(
      "name customerName status startDate budget"
    );

    if (!sites || sites.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sites found for this organization",
      });
    }

    // ✅ Format response
    const formattedSites = sites.map((site) => ({
      id: site._id, // rename _id → id for frontend convenience
      name: site.name,
      customerName: site.customerName,
      status: site.status,
      startDate: site.startDate,
      bugets: site.budget,
    }));

    return res.status(200).json({
      success: true,
      message: "Sites loaded successfully",
      data: formattedSites,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};


// push the labour id 
import mongoose from "mongoose";


export const addLaboursToSite = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    let { labourIds } = req.body; // expects array of strings

    // validate siteId
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({ success: false, message: "Invalid siteId" });
    }

    // validate labourIds
    if (!Array.isArray(labourIds) || labourIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ success: false, message: "Invalid labourIds" });
    }

    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({ success: false, message: "Site not found" });
    }

    // Push new labours without duplicates
    const uniqueLabours = labourIds
      .map(id => new mongoose.Types.ObjectId(id))
      .filter(id => !site.labours.includes(id));

    site.labours.push(...uniqueLabours);

    await site.save();

    return res.status(200).json({
      success: true,
      message: "Labours added successfully",
      data: site.labours,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
