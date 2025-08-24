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
import {
  createTask,
  getAllTasks,
  getTask,
  checkTaskAccess,
} from "../controllers/common/task";
import {
  addExpense,
  getSiteExpenses,
  getExpenseById,
  getSiteTools,
  getSiteInventory,
  getOrganizationVendors,
} from "../controllers/common/expenses";
import {
  addService,
  getAllServices,
} from "../controllers/common/vendorServices";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { addInventory } from "../controllers/common/inventory";
import { updateTask } from "../controllers/common/task";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  manageOrgPageData,
  getLabourProfileDetails,
  getSupervisorProfileDetails,
  getVendorProfileDetails,
  deleteSupervisor,
  getLabours,
} from "../controllers/common/manageOrganisation";
import { getsites, addLaboursToSite } from "../controllers/common/sites";
import { upload } from "../middlewares/multer";

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
router.get("/services", getAllServices);

router.post("/add-expenses", upload.array("receipts", 10), addExpense);
router.get("/view-expenses/:siteId", getSiteExpenses);
router.get("/site-tools/:siteId", getSiteTools);
router.get("/site-inventory/:siteId", getSiteInventory);
router.get("/organization-vendors", getOrganizationVendors);

// More specific routes
router.get("/expense/:expenseId", getExpenseById);

router.post("/add-inventory", addInventory);

router.patch("/update-task/:taskId", updateTask);

router.get("/manage-org-page-data/:orgId", manageOrgPageData);
router.get("/labourlists/:orgId", getLabours);

router.get("/siteslist/:orgId", getsites);
router.post("/addlabours/:siteId", addLaboursToSite);

router.get("/labour/:labourId", getLabourProfileDetails);
router.get("/supervisor/:supervisorId", getSupervisorProfileDetails);
router.delete("/supervisors/:supervisorId", deleteSupervisor);
router.get("/vendor/:vendorId", getVendorProfileDetails);

router.post("/create-task", upload.array("attachments", 10), createTask);
router.get("/tasks", getAllTasks);
router.get("/tasks/:taskId", checkTaskAccess, getTask);

export default router;
