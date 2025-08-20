import { Request, Response } from "express";
import { Inventory } from "../../models/Inventory";
import { Expense } from "../../models/Expense";

export const addInventory = async (req: Request, res: Response) => {
  try {
    const {
      name,
      specification,
      siteId,
      unit,
      category,
      quantity,
      minQuantity,
      unitPrice,
      vendor,
      paidBy,
      paymentMethod,
      note,
      receiptUrl, 
      status, 
    } = req.body;

    // 1️⃣ Create Inventory
    const inventory = new Inventory({
      name,
      specification,
      siteId,
      unit,
      category,
      quantity,
      minQuantity,
      unitPrice,
      vendor,
    });

    await inventory.save();

    const totalAmount = quantity * unitPrice;

    const expense = new Expense({
      siteId,
      description: `Inventory purchase: ${name} (${specification || "N/A"})`,
      amount: totalAmount,
      date: new Date(),
      paidBy,
      paymentMethod,
      category: "inventory",
      vendor,
      status, 
      receiptUrl,
      note,
    });

    await expense.save();

    res.status(201).json({
      success: true,
      message: "Inventory and Expense added successfully",
      data: {
        inventory,
        expense,
      },
    });
  } catch (error) {
    console.error("Error adding inventory with expense:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add inventory and expense",
      error: (error as Error).message,
    });
  }
};


// Get All Inventories
export const getInventories = async (_req: Request, res: Response) => {
  try {
    const inventories = await Inventory.find()
      .populate("site")
      .populate("vendor");
    res.json(inventories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Inventory by ID
export const getInventoryById = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate("site")
      .populate("vendor");

    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    res.json(inventory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update Inventory by ID
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    res.json(inventory);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Inventory by ID
export const deleteInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    res.json({ message: "Inventory deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
