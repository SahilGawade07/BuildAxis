import { Router } from "express";
import {
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from "../controllers/common/inventory";

const router = Router();

router.get("/", getInventories); // Read All
router.get("/:id", getInventoryById); // Read One
router.put("/:id", updateInventory); // Update
router.delete("/:id", deleteInventory); // Delete

export default router;
