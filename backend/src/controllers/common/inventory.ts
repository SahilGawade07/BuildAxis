import { Request, Response } from "express";
import { Inventory } from "../../models/Inventory"; // Adjust path if needed

// Create Inventory
export const createInventory = async (req: Request, res: Response) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    res.status(201).json(inventory);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
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
