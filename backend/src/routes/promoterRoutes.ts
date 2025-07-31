import { Router } from "express";
import { createSite } from "../controllers/promoter/promoter";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.post("/site", authenticateJWT, createSite);

export default router;
