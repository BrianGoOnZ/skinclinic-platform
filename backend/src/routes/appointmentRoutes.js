import express from "express";
import {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  checkAppointmentConflict,
} from "../controllers/appointmentController.js";
import { protect, restrictTo } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getAllAppointments);
router.get("/check-conflict", protect, checkAppointmentConflict);
router.post("/", protect, restrictTo("Administrador"), createAppointment);
router.put("/:id", protect, restrictTo("Administrador"), updateAppointment);
router.patch(
  "/:id/status",
  protect,
  restrictTo("Administrador"),
  updateAppointmentStatus,
);

export default router;
