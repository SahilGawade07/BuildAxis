import { Router } from "express";
import {
  createInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from "../controllers/common/inventory";

const router = Router();

router.post("/", createInventory); // Create
router.get("/", getInventories); // Read All
router.get("/:id", getInventoryById); // Read One
router.put("/:id", updateInventory); // Update
router.delete("/:id", deleteInventory); // Delete

export default router;
