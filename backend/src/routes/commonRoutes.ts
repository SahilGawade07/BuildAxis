import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  updatePassword,
} from "../controllers/common/MyProfile";
import {
  createVendor,
  getVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
} from "../controllers/common/vendor";
import { createTask } from "../controllers/common/task";
import { addExpense, getSiteExpenses } from "../controllers/common/expenses";
import { addService } from "../controllers/common/vendorServices";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { addInventory } from "../controllers/common/inventory";
import { updateTask } from "../controllers/common/task";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { manageOrgPageData } from "../controllers/common/manageOrganisation";
import { getsites } from "../controllers/common/sites";

const router = Router();

router.use(authenticateJWT);
router.use(isAuthenticated);

router.get("/my-profile", getMyProfile);
router.put("/my-profile", updateMyProfile);
router.patch("/my-profile", updatePassword);

router.post("/vendors", createVendor);
router.get("/vendors", getAllVendors);
router.get("/vendors/:vendorId", getVendor);
router.put("/vendors/:vendorId", updateVendor);
router.delete("/vendors/:vendorId", deleteVendor);

router.post("/add-service", addService);

router.post("/add-expenses", addExpense);
router.get("/view-expenses/:siteId", getSiteExpenses);

router.post("/add-inventory", addInventory);

router.patch("/update-task/:taskId", updateTask);

router.get("/manage-org-page-data/:orgId", manageOrgPageData);
router.get("/siteslist/:orgId", getsites);

// router.post("/create-task", createTask);

export default router;
