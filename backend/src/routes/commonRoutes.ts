import { Router } from "express";
import { getMyProfile, updateMyProfile, updatePassword } from "../controllers/common/MyProfile";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.get("/my-profile", authenticateJWT, getMyProfile);
router.put("/my-profile", authenticateJWT, updateMyProfile);
router.patch("/my-profile", authenticateJWT, updatePassword);

export default router;
