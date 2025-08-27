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
import { Labour } from "../../models/Labour";


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


//display the list of labour
// // display the list of labours
// export const getLaboursBySite = async (req: Request, res: Response) => {
//   const { siteId } = req.params;

//   try {
//     // ✅ Check valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(siteId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid siteId",
//         data: [],
//       });
//     }

//     // ✅ Find the site and populate only selected fields of labours
//     const site = await Site.findById(siteId).populate({
//       path: "labours",
//       select: "_id fName lName profilePic work", // only selected fields
//     });

//     if (!site) {
//       return res.status(404).json({
//         success: false,
//         message: "Site not found",
//         data: [],
//       });
//     }

//     // ✅ If no labours assigned
//     if (!site.labours || site.labours.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "No labours assigned to this site",
//         data: [],
//       });
//     }

//     // ✅ Format labours data
//     const formattedLabours = site.labours.map((labour: any) => ({
//       id: labour._id,
//       fName: labour.fName,
//       lName: labour.lName,
//       profilePic: labour.profilePic,
//       work: labour.work,
//     }));

//     // ✅ Send formatted response
//     return res.json({
//       success: true,
//       message: "Labours loaded successfully",
//       data: formattedLabours,
//     });
//   } catch (err) {
//     console.error("Error fetching labours:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       data: [],
//     });
//   }
// };




// Common API to get labours or supervisors of a site
export const getLaboursBySite = async (req: Request, res: Response) => {
  const { siteId, type } = req.params; // type = "labour" | "supervisor"

  try {
    // ✅ Check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid siteId",
        data: [],
      });
    }

    // ✅ Validate type
    if (!["labour", "supervisor"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use 'labour' or 'supervisor'.",
        data: [],
      });
    }

    // ✅ Decide which field to populate
    const field = type === "labour" ? "labours" : "supervisors";

    // ✅ Find site and populate required field
    const site = await Site.findById(siteId).populate({
      path: field,
      select: "_id fName lName profilePic work role", // add role if needed
    });

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
        data: [],
      });
    }

    // ✅ Extract data
    const people = site[field];

    if (!people || people.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No ${type}s assigned to this site`,
        data: [],
      });
    }

    // ✅ Format data
    const formatted = people.map((p: any) => ({
      id: p._id,
      fName: p.fName,
      lName: p.lName,
      profilePic: p.profilePic,
      work: p.work,
      role: p.role || type, // fallback
    }));

    // ✅ Send response
    return res.json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)}s loaded successfully`,
      data: formatted,
    });
  } catch (err) {
    console.error("Error fetching people:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
    });
  }
};
