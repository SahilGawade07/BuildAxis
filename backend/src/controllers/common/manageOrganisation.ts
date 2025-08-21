import { Request, Response } from "express";
import { Organisation } from "../../models/Organisation";

export const manageOrgPageData = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "orgId is not provided",
      });
    }

    // Fetch org with all required populations in ONE call
    const org = await Organisation.findById(orgId)
      .select("promoters supervisorsId labourId vendor")
      .populate({
        path: "promoters",
        select: "fName lName profilePic _id",
        options: { limit: 7 },
      })
      .populate({
        path: "supervisorsId",
        select: "fName lName profilePic _id",
        options: { limit: 7 },
      })
      .populate({
        path: "labourId",
        select: "fName lName profilePic phone work _id",
        options: { limit: 7 },
      })
      .populate({
        path: "vendor",
        select: "vendorName _id",
        options: { limit: 7 },
      });


    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organisation not found",
      });
    }

    // Split role-wise
    const promoters = org.promoters || [];
    const supervisors = org.supervisorsId || [];
    const labours = org.labourId || [];
    const vendors = org.vendor || [];

    return res.json({
      success: true,
      data: {
        promoters,
        supervisors,
        labours,
        vendors,
      },
    });
  } catch (error: any) {
    console.error("Error fetching org page data:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
