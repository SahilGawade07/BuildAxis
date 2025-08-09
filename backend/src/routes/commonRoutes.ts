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
import { addService } from "../controllers/common/vendorServices";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { isAuthenticated } from "../middlewares/isAuthenticated";

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

// router.post("/create-task", createTask);

export default router;
