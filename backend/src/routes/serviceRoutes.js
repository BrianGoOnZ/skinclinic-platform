import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deactivateService,
  reactivateService,
} from "../controllers/serviceController.js";
import { protect, restrictTo } from "../middlewares/auth.js";
import { cacheMiddleware } from "../middlewares/cache.js";

const router = express.Router();

router.get("/", protect, cacheMiddleware("services", 120), getAllServices);
router.get("/:id", protect, cacheMiddleware("services", 120), getServiceById);

router.post("/", protect, restrictTo("Administrador"), createService);
router.put("/:id", protect, restrictTo("Administrador"), updateService);
router.patch(
  "/:id/delete",
  protect,
  restrictTo("Administrador"),
  deactivateService,
);
router.patch(
  "/:id/reactivate",
  protect,
  restrictTo("Administrador"),
  reactivateService,
);

export default router;
