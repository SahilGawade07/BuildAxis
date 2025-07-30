import { Router } from "express";
import {
  createOrganisation,
  getOrganisation,
  updateOrganisation,
  deleteOrganisation,
  addSupervisor,
  createSupervisor,
} from "../controllers/organisation/organisation";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.post("/", createOrganisation);
router.get("/:orgId", getOrganisation);
router.put("/:orgId", updateOrganisation);
router.delete("/:orgId", deleteOrganisation);
router.post("/add-supervisor", addSupervisor);
router.post("/create-supervisor", createSupervisor);

export default router;
