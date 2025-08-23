import { Router } from "express";
import {
  createOrganisation,
  getOrganisation,
  updateOrganisation,
  deleteOrganisation,
  addSupervisor,
  createSupervisor,
  addLabour,
  createLabour,
} from "../controllers/organisation/organisation";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { isPromoter } from "../middlewares/isPromoter";
import { upload } from "../middlewares/multer";


const router = Router();

router.use(authenticateJWT);

router.post("/",isPromoter, createOrganisation);
router.get("/:orgId", getOrganisation);
router.put("/:orgId", updateOrganisation);
router.delete("/:orgId", deleteOrganisation);
router.post("/add-supervisor", addSupervisor);
// router.post("/create-supervisor", createSupervisor);
router.post(
  "/create-supervisor",
  upload.single("profilePic"),
  createSupervisor
);
router.post("/add-labour", addLabour);
router.post("/create-labour", createLabour);

export default router;
