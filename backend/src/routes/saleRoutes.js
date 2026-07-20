import express from "express";
import {
  createSale,
  registerPayment,
  getSalesHistory,
  getSaleById,
  getTodayIncome,
  getMonthlySummary,
} from "../controllers/saleController.js";
import { protect, restrictTo } from "../middlewares/auth.js";

const router = express.Router();

router.get("/today-income", protect, getTodayIncome);
router.get(
  "/monthly-summary",
  protect,
  restrictTo("Administrador"),
  getMonthlySummary,
);
router.get("/", protect, restrictTo("Administrador"), getSalesHistory);
router.get("/:id", protect, restrictTo("Administrador"), getSaleById);
router.post("/", protect, restrictTo("Administrador"), createSale);
router.post(
  "/:id/payments",
  protect,
  restrictTo("Administrador"),
  registerPayment,
);

export default router;
