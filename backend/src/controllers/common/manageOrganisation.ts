import { Request, Response } from "express";
import { Organisation } from "../../models/Organisation";
import { User } from "../../models/User";
import { Labour } from "../../models/Labour";
import { Vendor } from "../../models/Vendor";
import { Service } from "../../models/Services";

export const manageOrgPageData = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const { all, page = "1", role } = req.query;
    const pageNumber = parseInt(page as string) || 1;
    const limit = 15;
    const skip = (pageNumber - 1) * limit;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "orgId is not provided",
      });
    }

    // If all flag is true, return paginated results based on role
    if (all === "true") {
      let query: any = { orgId };
      let totalCount = 0;
      let people: any[] = [];

      // Filter by role if provided
      if (role) {
        if (role === "promoter" || role === "supervisor") {
          // Get users (promoters/supervisors) with pagination
          query.role = role;
          const users = await User.find(query)
            .select("fName lName profilePic _id role email phone")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

          totalCount = await User.countDocuments(query);
          people = users.map((user) => ({
            _id: user._id,
            fName: user.fName,
            lName: user.lName,
            profilePic: user.profilePic,
            role: user.role,
            email: user.email,
            phone: user.phone,
            type: "user",
          }));
        } else if (role === "labour") {
          // Get labours with pagination
          const labours = await Labour.find({ orgId })
            .select("fName lName profilePic _id work")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

          totalCount = await Labour.countDocuments({ orgId });
          people = labours.map((labour) => ({
            _id: labour._id,
            fName: labour.fName,
            lName: labour.lName,
            profilePic: labour.profilePic,
            work: labour.work,
            type: "labour",
          }));
        } else if (role === "vendor") {
          // Get organisation to access vendor IDs
          const org = await Organisation.findById(orgId).select("vendor");
          if (!org) {
            return res.status(404).json({
              success: false,
              message: "Organisation not found",
            });
          }

          // Get vendors with pagination
          const vendors = await Vendor.find({ _id: { $in: org.vendor } })
            .select("vendorName _id")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

          totalCount = await Vendor.countDocuments({
            _id: { $in: org.vendor },
          });
          people = vendors.map((vendor) => ({
            _id: vendor._id,
            vendorName: vendor.vendorName,
            type: "vendor",
          }));
        }
      } else {
        // If no role specified, get all types combined
        // First get the organisation to access vendor IDs
        const org = await Organisation.findById(orgId).select("vendor");
        if (!org) {
          return res.status(404).json({
            success: false,
            message: "Organisation not found",
          });
        }

        // Get all users (promoters and supervisors) with pagination
        const users = await User.find({ orgId })
          .select("fName lName profilePic _id role email phone")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

        // Get all labours with pagination
        const labours = await Labour.find({ orgId })
          .select("fName lName profilePic _id work")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

        // Get all vendors with pagination
        const vendors = await Vendor.find({ _id: { $in: org.vendor } })
          .select("vendorName _id")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

        // Get total counts for pagination
        const totalUsers = await User.countDocuments({ orgId });
        const totalLabours = await Labour.countDocuments({ orgId });
        const totalVendors = await Vendor.countDocuments({
          _id: { $in: org.vendor },
        });

        // Combine all results
        const allPeople = [
          ...users.map((user) => ({ ...user.toObject(), type: "user" })),
          ...labours.map((labour) => ({
            ...labour.toObject(),
            type: "labour",
          })),
          ...vendors.map((vendor) => ({
            ...vendor.toObject(),
            type: "vendor",
          })),
        ];

        // Sort combined results by creation date
        allPeople.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Apply pagination to combined results
        people = allPeople.slice(skip, skip + limit);
        totalCount = totalUsers + totalLabours + totalVendors;
      }

      return res.json({
        success: true,
        data: {
          people: people,
          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            hasNextPage: pageNumber < Math.ceil(totalCount / limit),
            hasPrevPage: pageNumber > 1,
          },
        },
      });
    } else {
      // Original logic for limited results
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
    }
  } catch (error: any) {
    console.error("Error fetching org page data:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLabourProfileDetails = async (req: Request, res: Response) => {
  try {
    const { labourId } = req.params;
    const user = (req as any).dbUser;

    if (!labourId) {
      return res.status(400).json({
        success: false,
        message: "Labour ID is required",
      });
    }

    // Find the labour by ID
    const labour = await Labour.findById(labourId).select(
      "fName lName phone work profilePic orgId createdAt updatedAt"
    );

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: "Labour not found",
      });
    }

    // Check if user has access to this labour (same organisation)
    if (String(labour.orgId) !== String(user.orgId)) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this labour",
      });
    }

    // Get additional organization context if needed
    const org = await Organisation.findById(labour.orgId).select("name");

    return res.json({
      success: true,
      data: {
        _id: labour._id,
        fName: labour.fName,
        lName: labour.lName,
        phone: labour.phone,
        work: labour.work,
        profilePic: labour.profilePic,
        orgId: labour.orgId,
        orgName: org?.name || "Unknown Organization",
        createdAt: labour.createdAt,
        updatedAt: labour.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error fetching labour profile details:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getSupervisorProfileDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const { supervisorId } = req.params;
    const user = (req as any).dbUser;

    if (!supervisorId) {
      return res.status(400).json({
        success: false,
        message: "Supervisor ID is required",
      });
    }

    // Find the supervisor by ID
    const supervisor = await User.findById(supervisorId).select(
      "fName lName email phone profilePic orgId role createdAt updatedAt"
    );

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    // Check if the user is actually a supervisor
    if (supervisor.role !== "supervisor") {
      return res.status(400).json({
        success: false,
        message: "User is not a supervisor",
      });
    }

    // Check if user has access to this supervisor (same organisation)
    if (String(supervisor.orgId) !== String(user.orgId)) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this supervisor",
      });
    }

    // Get additional organization context if needed
    const org = await Organisation.findById(supervisor.orgId).select("name");

    return res.json({
      success: true,
      data: {
        _id: supervisor._id,
        fName: supervisor.fName,
        lName: supervisor.lName,
        email: supervisor.email,
        phone: supervisor.phone,
        profilePic: supervisor.profilePic,
        role: supervisor.role,
        orgId: supervisor.orgId,
        orgName: org?.name || "Unknown Organization",
        createdAt: supervisor.createdAt,
        updatedAt: supervisor.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error fetching supervisor profile details:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getVendorProfileDetails = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const user = (req as any).dbUser;

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID is required",
      });
    }

    // Find the vendor by ID and populate services
    const vendor = await Vendor.findById(vendorId)
      .populate("services", "serviceName")
      .select(
        "vendorName contactPerson phoneNo address services gstNumber createdAt updatedAt"
      );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Get the organization to check access and get org name
    const org = await Organisation.findOne({ vendor: vendorId }).select("name");

    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Vendor not associated with any organization",
      });
    }

    // Check if user has access to this vendor (same organisation)
    if (String(org._id) !== String(user.orgId)) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this vendor",
      });
    }

    // Debug: Log the vendor data to see what services look like
    console.log("Vendor data:", JSON.stringify(vendor, null, 2));
    console.log("Services:", vendor.services);

    // Prepare the response data
    const responseData = {
      _id: vendor._id,
      vendorName: vendor.vendorName,
      contactPerson: vendor.contactPerson,
      phoneNo: vendor.phoneNo,
      address: vendor.address,
      services:
        vendor.services?.map((service: any) => service.serviceName) || [],
      gstNumber: vendor.gstNumber,
      orgId: org._id,
      orgName: org.name,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
    };

    console.log("Response data:", JSON.stringify(responseData, null, 2));
    console.log("Services in response:", responseData.services);

    return res.json({
      success: true,
      data: responseData,
    });
  } catch (error: any) {
    console.error("Error fetching vendor profile details:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteSupervisor = async (req: Request, res: Response) => {
  try {
    const { supervisorId } = req.params;
    const user = (req as any).dbUser;

    if (!supervisorId) {
      return res.status(400).json({
        success: false,
        message: "Supervisor ID is required",
      });
    }

    // Find the supervisor by ID
    const supervisor = await User.findById(supervisorId).select("orgId role");

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    // Check if the user is actually a supervisor
    if (supervisor.role !== "supervisor") {
      return res.status(400).json({
        success: false,
        message: "User is not a supervisor",
      });
    }

    // Check if user has access to this supervisor (same organisation)
    if (String(supervisor.orgId) !== String(user.orgId)) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this supervisor",
      });
    }

    // Remove supervisor from organisation's supervisorsId array
    await Organisation.findByIdAndUpdate(supervisor.orgId, {
      $pull: { supervisorsId: supervisorId },
    });

    // Delete the supervisor user
    await User.findByIdAndDelete(supervisorId);

    return res.json({
      success: true,
      message: "Supervisor deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting supervisor:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
