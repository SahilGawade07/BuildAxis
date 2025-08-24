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
