import { Router } from "express";
import {
  signIn,
  signUp,
  refreshToken,
  logout,
  addSupervisor,
} from "../controllers/Auth/auth";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/add-supervisor", authenticateJWT, addSupervisor);

export default router;
