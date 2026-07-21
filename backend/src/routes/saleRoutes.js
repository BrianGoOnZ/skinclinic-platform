import express from "express";
import {
  createSale,
  registerPayment,
  getSalesHistory,
  getSaleById,
  getTodayIncome,
  getMonthlySummary,
  getPendingAccounts,
  getCustomerPendingDebts,
  exportSalesPdf,
} from "../controllers/saleController.js";
import { protect, restrictTo } from "../middlewares/auth.js";
import { writeLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/today-income", protect, getTodayIncome);
router.get(
  "/monthly-summary",
  protect,
  restrictTo("Administrador"),
  getMonthlySummary,
);
router.get(
  "/pending-accounts",
  protect,
  restrictTo("Administrador"),
  getPendingAccounts,
);
router.get("/customer-debts/:customerId", protect, getCustomerPendingDebts);
router.get("/export-pdf", protect, restrictTo("Administrador"), exportSalesPdf);
router.get("/", protect, restrictTo("Administrador"), getSalesHistory);
router.get("/:id", protect, restrictTo("Administrador"), getSaleById);
router.post(
  "/",
  protect,
  restrictTo("Administrador"),
  writeLimiter,
  createSale,
);
router.post(
  "/:id/payments",
  protect,
  restrictTo("Administrador"),
  writeLimiter,
  registerPayment,
);

export default router;
