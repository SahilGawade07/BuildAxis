import { Request, Response } from "express";
import { Expense } from "../../models/Expense";
import { Inventory } from "../../models/Inventory";
import { Tool } from "../../models/Tool";
import { Site } from "../../models/Site";

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
      receiptUrl,
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

      // Inventory-specific
      inventoryName,
      inventoryQuantity,
      unitPrice,
      unit,
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

    let linkedDocId = null;

    // ✅ TOOL category
    if (category === "tool") {
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
        siteId,
        category: toolCategory, // owned | rented
        vendor,
        amount,
        remark: toolRemark,
      });

      await newTool.save();
      linkedDocId = newTool._id;
    }

    // ✅ INVENTORY category
    // ✅ If category = inventory
    if (category === "inventory") {
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
          siteId, // ✅ use only this
          name: inventoryName,
          quantity: inventoryQuantity,
          unitPrice,
          unit,
          category: "inventory", // ✅ enforce category
        });

        await newInventory.save();
        linkedDocId = newInventory._id;
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
      receiptUrl,
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

export const getSiteExpenses = async (req: Request, res: Response) => {
  try {
    const { siteId, orgId } = req.body;
    const dbUser = (req as any).dbUser;

    const page = parseInt(req.query.page as string) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    // ✅ check if site exists and belongs to promoter of org
    const site = await Site.findOne({ _id: siteId, orgId });

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


    // ✅ fetch expenses for this site only
    const expenses = await Expense.find({ siteId })
      .populate("siteId", "name orgId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalExpenses = await Expense.countDocuments({ siteId });
    const totalPages = Math.ceil(totalExpenses / limit);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalExpenses,
      expenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};