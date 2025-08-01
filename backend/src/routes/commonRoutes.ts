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
import { addService } from "../controllers/common/vendorServices";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.get("/my-profile", authenticateJWT, getMyProfile);
router.put("/my-profile", authenticateJWT, updateMyProfile);
router.patch("/my-profile", authenticateJWT, updatePassword);

// Vendor routes
router.post("/vendors", authenticateJWT, createVendor);
router.get("/vendors", authenticateJWT, getAllVendors);
router.get("/vendors/:vendorId", authenticateJWT, getVendor);
router.put("/vendors/:vendorId", authenticateJWT, updateVendor);
router.delete("/vendors/:vendorId", authenticateJWT, deleteVendor);

router.post("/add-service", authenticateJWT, addService);

export default router;
