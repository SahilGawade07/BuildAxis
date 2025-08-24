import { Request, Response } from "express";
import { Expense } from "../../models/Expense";
import { Inventory } from "../../models/Inventory";
import { Tool } from "../../models/Tool";
import { Site } from "../../models/Site";
import { Vendor } from "../../models/Vendor";
import { uploadOnCloudinary } from "../../utils/cloudinary";

export const addExpense = async (req: Request, res: Response) => {
  try {
    const {
      siteId,
      description,
      amount,
      date,
      paidBy,
      paymentMethod,
      category,
      status,
      vendor,
      note,
      dueAmount,

      // Tool-specific
      toolName,
      toolUnit,
      toolQuantity,
      toolCategory,
      toolRemark,
      existingToolId,

      // Inventory-specific
      inventoryName,
      inventoryQuantity,
      unitPrice,
      unit,
      existingInventoryId,
    } = req.body;

    // ✅ Common required fields
    if (
      !siteId ||
      !description ||
      !amount ||
      !date ||
      !paidBy ||
      !paymentMethod ||
      !category
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required expense fields" });
    }

    // Handle file uploads - upload to Cloudinary and store URLs
    const receiptUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        try {
          const uploadResult = await uploadOnCloudinary(file.path);
          if (uploadResult?.secure_url) {
            receiptUrls.push(uploadResult.secure_url);
          }
        } catch (uploadError) {
          console.error("Error uploading receipt to Cloudinary:", uploadError);
        }
      }
    }

    let linkedDocId = null;

    // ✅ TOOL category
    if (category === "tool") {
      if (existingToolId) {
        // Use existing tool
        const existingTool = await Tool.findById(existingToolId);
        if (!existingTool) {
          return res.status(404).json({
            success: false,
            message: "Tool not found",
          });
        }
        linkedDocId = existingTool._id;
      } else {
        // Create new tool
        if (!toolName || !toolUnit || !toolQuantity || !toolCategory) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields for Tool",
          });
        }

        const newTool = new Tool({
          name: toolName,
          unit: toolUnit,
          quantity: toolQuantity,
          site: siteId,
          category: toolCategory, // owned | rented
          vendor,
          amount,
          remark: toolRemark,
        });

        await newTool.save();
        linkedDocId = newTool._id;
      }
    }

    // ✅ INVENTORY category
    if (category === "inventory") {
      if (existingInventoryId) {
        // Use existing inventory
        const existingInventory = await Inventory.findById(existingInventoryId);
        if (!existingInventory) {
          return res.status(404).json({
            success: false,
            message: "Inventory not found",
          });
        }
        linkedDocId = existingInventory._id;
      } else {
        // Create new inventory
        if (!inventoryName || !inventoryQuantity || !unitPrice || !unit) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields for Inventory",
          });
        }

        // Check if inventory already exists for the site + name
        let existingInventory = await Inventory.findOne({
          siteId: siteId,
          name: inventoryName,
        });

        if (existingInventory) {
          // Update existing quantity & price if needed
          existingInventory.quantity += Number(inventoryQuantity);
          existingInventory.unitPrice = unitPrice;
          existingInventory.unit = unit;

          await existingInventory.save();
          linkedDocId = existingInventory._id;
        } else {
          // Create new inventory
          const newInventory = new Inventory({
            siteId,
            name: inventoryName,
            quantity: inventoryQuantity,
            unitPrice,
            unit,
            category: "inventory",
          });

          await newInventory.save();
          linkedDocId = newInventory._id;
        }
      }
    }

    // ✅ Create Expense
    const newExpense = new Expense({
      siteId,
      description,
      amount,
      date,
      paidBy,
      paymentMethod,
      category,
      receiptUrls,
      status,
      vendor,
      note,
      dueAmount,
      ...(category === "tool" && { tool: linkedDocId }),
      ...(category === "inventory" && { inventory: linkedDocId }),
    });

    await newExpense.save();

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error: any) {
    console.error("Error adding expense:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get tools for a site
export const getSiteTools = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    const tools = await Tool.find({ site: siteId }).select(
      "name unit quantity category"
    );

    return res.status(200).json({
      success: true,
      message: "Tools retrieved successfully",
      data: tools,
    });
  } catch (error: any) {
    console.error("Error getting site tools:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get inventory for a site
export const getSiteInventory = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    const inventory = await Inventory.find({ siteId }).select(
      "name quantity unit unitPrice"
    );

    return res.status(200).json({
      success: true,
      message: "Inventory retrieved successfully",
      data: inventory,
    });
  } catch (error: any) {
    console.error("Error getting site inventory:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSiteExpenses = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    const dbUser = (req as any).dbUser;

    if (!siteId) {
      return res.status(400).json({
        success: false,
        message: "Site ID is required",
      });
    }

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!dbUser.orgId) {
      return res.status(400).json({
        success: false,
        message: "User organization not found",
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    // Check if site exists and belongs to promoter of org
    const site = await Site.findOne({ _id: siteId, orgId: dbUser.orgId });

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found for this organization",
      });
    }

    if (!site.promoters.some((id) => id.toString() === dbUser._id.toString())) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view expenses for this site",
      });
    }

    // Fetch expenses for this site only with populated user info
    const expenses = await Expense.find({ siteId })
      .populate("paidBy", "fName lName")
      .select("description amount date paidBy status category paymentMethod")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalExpenses = await Expense.countDocuments({ siteId });
    const totalPages = Math.ceil(totalExpenses / limit);

    // Return success even if no expenses found
    return res.status(200).json({
      success: true,
      data: {
        currentPage: page,
        totalPages,
        totalExpenses,
        expenses: expenses || [],
      },
      message:
        totalExpenses === 0
          ? "No expenses found for this site"
          : "Expenses retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get single expense by ID
export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;
    const dbUser = (req as any).dbUser;

    if (!expenseId) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required",
      });
    }

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!dbUser.orgId) {
      return res.status(400).json({
        success: false,
        message: "User organization not found",
      });
    }

    // Find the expense and populate related data
    const expense = await Expense.findById(expenseId)
      .populate("paidBy", "fName lName email phone")
      .populate("siteId", "name location")
      .populate("vendorId", "vendorName contactPerson phoneNo");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Check if user has access to this expense (through site access)
    const site = await Site.findOne({
      _id: expense.siteId,
      orgId: dbUser.orgId,
      promoters: dbUser._id,
    });

    if (!site) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this expense",
      });
    }

    return res.status(200).json({
      success: true,
      data: expense,
      message: "Expense retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get vendors for the organization
export const getOrganizationVendors = async (req: Request, res: Response) => {
  try {
    const user = (req as any).dbUser;
    if (!user || !user.orgId) {
      return res.status(400).json({
        success: false,
        message: "User organization not found",
      });
    }

    // First get the organization to access its vendors
    const { Organisation } = await import("../../models/Organisation");
    const organization = await Organisation.findById(user.orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const vendors = await Vendor.find({ _id: { $in: organization.vendor } })
      .select("vendorName contactPerson phoneNo address gstNumber")
      .sort({ vendorName: 1 });

    return res.status(200).json({
      success: true,
      message: "Vendors retrieved successfully",
      data: vendors,
    });
  } catch (error: any) {
    console.error("Error getting organization vendors:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
