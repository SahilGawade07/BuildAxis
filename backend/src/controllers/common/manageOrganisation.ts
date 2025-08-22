import { Request, Response } from "express";
import { Organisation } from "../../models/Organisation";
import { User } from "../../models/User";
import { Labour } from "../../models/Labour";
import { Vendor } from "../../models/Vendor";

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
            .select("fName lName profilePic _id phone work")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

          totalCount = await Labour.countDocuments({ orgId });
          people = labours.map((labour) => ({
            _id: labour._id,
            fName: labour.fName,
            lName: labour.lName,
            profilePic: labour.profilePic,
            phone: labour.phone,
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
            .select("vendorName _id contactPerson phoneNo")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

          totalCount = await Vendor.countDocuments({
            _id: { $in: org.vendor },
          });
          people = vendors.map((vendor) => ({
            _id: vendor._id,
            vendorName: vendor.vendorName,
            contactPerson: vendor.contactPerson,
            phoneNo: vendor.phoneNo,
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
          .select("fName lName profilePic _id phone work")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

        // Get all vendors with pagination
        const vendors = await Vendor.find({ _id: { $in: org.vendor } })
          .select("vendorName _id contactPerson phoneNo")
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
