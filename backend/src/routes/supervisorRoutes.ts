import { Router } from "express";
import { createTaskS } from "../controllers/Supervisor/task";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { isPromoter } from "../middlewares/isPromoter";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.use(authenticateJWT);
router.use(isAuthenticated);

router.post("/create-task", createTaskS);

export default router;
