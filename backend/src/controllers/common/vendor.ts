import { Request, Response } from "express";
import { Vendor } from "../../models/Vendor";
import { Organisation } from "../../models/Organisation";
import { Types } from "mongoose";

export const createVendor = async (req: Request, res: Response) => {
  try {
    const { vendorName, contactPerson, phoneNo, address, services, gstNumber } =
      req.body;

    // Get orgId from authenticated user's profile
    const user = (req as any).dbUser;
    if (!user || !user.orgId) {
      return res.status(400).json({
        success: false,
        message:
          "User organisation not found. Please ensure you are part of an organisation.",
      });
    }

    const orgId = user.orgId;

    if (!vendorName || !contactPerson || !phoneNo || !address) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Check if vendor with same phone number already exists
    const existingVendor = await Vendor.findOne({ phoneNo });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor with this phone number already exists",
      });
    }

    const newVendor = await Vendor.create({
      vendorName,
      contactPerson,
      phoneNo,
      address,
      services: services || [],
      gstNumber,
    });

    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
      return res.status(404).json({
        success: false,
        message: "Organisation not found",
      });
    }

    organisation.vendor.push(newVendor._id as Types.ObjectId);
    await organisation.save();

    return res.status(201).json({
      success: true,
      message: "Vendor created and added to organisation successfully",
      data: {
        vendorId: newVendor._id,
        vendorName: newVendor.vendorName,
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

export const getVendor = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId;

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID is required",
      });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendor retrieved successfully",
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    // Get orgId from authenticated user's profile
    const user = (req as any).dbUser;
    if (!user || !user.orgId) {
      return res.status(400).json({
        success: false,
        message:
          "User organisation not found. Please ensure you are part of an organisation.",
      });
    }

    const orgId = user.orgId;

    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
      return res.status(404).json({
        success: false,
        message: "Organisation not found",
      });
    }

    const vendors = await Vendor.find({ _id: { $in: organisation.vendor } });

    return res.status(200).json({
      success: true,
      message: "Vendors retrieved successfully",
      data: vendors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const { vendorName, contactPerson, phoneNo, address, services, gstNumber } =
      req.body;

    const vendorId = req.params.vendorId;

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID is required",
      });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Check if phone number is being updated and if it already exists
    if (phoneNo && phoneNo !== vendor.phoneNo) {
      const existingVendor = await Vendor.findOne({
        phoneNo,
        _id: { $ne: vendorId },
      });
      if (existingVendor) {
        return res.status(400).json({
          success: false,
          message: "Vendor with this phone number already exists",
        });
      }
    }

    vendor.vendorName = vendorName || vendor.vendorName;
    vendor.contactPerson = contactPerson || vendor.contactPerson;
    vendor.phoneNo = phoneNo || vendor.phoneNo;
    vendor.address = address || vendor.address;
    vendor.services = services || vendor.services;
    vendor.gstNumber = gstNumber || vendor.gstNumber;

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId;

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID is required",
      });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Remove vendor reference from organisation
    await Organisation.updateMany(
      { vendor: vendorId },
      { $pull: { vendor: vendorId } } // Use $pull instead of $unset
    );

    // Delete the vendor
    await Vendor.findByIdAndDelete(vendorId);

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
