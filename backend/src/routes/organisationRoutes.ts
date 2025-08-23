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
  checkOrgAccessFromParams,
  checkPromoterAccess,
} from "../controllers/organisation/organisation";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { isPromoter } from "../middlewares/isPromoter";
import { upload } from "../middlewares/multer";

const router = Router();

router.use(authenticateJWT);

router.post("/", isPromoter, createOrganisation);
router.get("/:orgId", checkOrgAccessFromParams, getOrganisation);
router.put(
  "/:orgId",
  checkOrgAccessFromParams,
  checkPromoterAccess,
  upload.single("logo"),
  updateOrganisation
);
router.delete(
  "/:orgId",
  checkOrgAccessFromParams,
  checkPromoterAccess,
  deleteOrganisation
);
router.post("/add-supervisor", addSupervisor);
// router.post("/create-supervisor", createSupervisor);
router.post(
  "/create-supervisor",
  upload.single("profilePic"),
  createSupervisor
);
router.post("/add-labour", addLabour);
router.post(
  "/create-labour",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "documentsUrl", maxCount: 10 },
  ]),
  createLabour
);

export default router;
