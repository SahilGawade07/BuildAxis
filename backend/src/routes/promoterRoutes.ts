import { Router } from "express";
import {
  createSite,
  updateSite,
  deleteSite,
} from "../controllers/promoter/promoter";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.post("/site", createSite);
router.put("/site/:siteId", updateSite);
router.delete("/site/:siteId", deleteSite);

export default router;
