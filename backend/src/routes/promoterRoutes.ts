import { Router } from "express";
import {
  createSite,
  updateSite,
  deleteSite,
} from "../controllers/promoter/promoter";
import { createTask } from "../controllers/promoter/task";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { isPromoter } from "../middlewares/isPromoter";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.use(authenticateJWT);
router.use(isAuthenticated);
router.use(isPromoter);

router.post("/site", createSite);
router.put("/site/:siteId", updateSite);
router.delete("/site/:siteId", deleteSite);

router.post("/create-task", createTask);

export default router;
