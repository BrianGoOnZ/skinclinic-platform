import express from "express";
import {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { protect, restrictTo } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getAllAppointments);
router.post("/", protect, restrictTo("Administrador"), createAppointment);
router.put("/:id", protect, restrictTo("Administrador"), updateAppointment);
router.patch(
  "/:id/status",
  protect,
  restrictTo("Administrador"),
  updateAppointmentStatus,
);

export default router;
