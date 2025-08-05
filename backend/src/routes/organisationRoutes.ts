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

const router = Router();

router.use(authenticateJWT);

router.post("/", createOrganisation);
router.get("/:orgId", getOrganisation);
router.put("/:orgId", updateOrganisation);
router.delete("/:orgId", deleteOrganisation);
router.post("/add-supervisor", addSupervisor);
router.post("/create-supervisor", createSupervisor);
router.post("/add-labour", addLabour);
router.post("/create-labour", createLabour);

export default router;
