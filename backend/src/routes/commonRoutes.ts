import { Router } from "express";
import { getMyProfile } from "../controllers/common/MyProfile";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.get("/", authenticateJWT,getMyProfile);

export default router;
