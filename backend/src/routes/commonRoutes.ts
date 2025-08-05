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
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();
router.use(authenticateJWT);

router.get("/my-profile", getMyProfile);
router.put("/my-profile", updateMyProfile);
router.patch("/my-profile", updatePassword);

router.post("/vendors", createVendor);
router.get("/vendors", getAllVendors);
router.get("/vendors/:vendorId", getVendor);
router.put("/vendors/:vendorId", updateVendor);
router.delete("/vendors/:vendorId", deleteVendor);

router.post("/add-service", addService);

export default router;
