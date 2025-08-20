import { Router } from "express";
import {
  createSite,
  updateSite,
  deleteSite,
} from "../controllers/promoter/promoter";
import { createTask } from "../controllers/promoter/task";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { isPromoter } from "../middlewares/isPromoter";
import { updateExpense, deleteExpense } from "../controllers/promoter/expenses";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.use(authenticateJWT);
router.use(isAuthenticated);
router.use(isPromoter);

router.post("/site", createSite);
router.put("/site/:siteId", updateSite);
router.delete("/site/:siteId", deleteSite);

router.post("/create-task", createTask);

router.patch("/update-expense/:expenseId", updateExpense);
router.delete("/delete-expense/:expenseId", deleteExpense);

export default router;
