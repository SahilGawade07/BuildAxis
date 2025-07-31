import { Router } from "express";
import { createSite,updateSite } from "../controllers/promoter/promoter";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.post("/site", authenticateJWT, createSite);
router.put("/site", authenticateJWT, updateSite);

export default router;
