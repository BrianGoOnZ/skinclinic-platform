import express from "express";
import {
  getLatestAssessmentByCustomer,
  getAssessmentHistoryByCustomer,
  getAssessmentByAppointment,
  createAssessment,
} from "../controllers/assessmentController.js";
import {
  protect,
  restrictTo,
  canAttendAppointment,
} from "../middlewares/auth.js";

const router = express.Router();

// Vista rápida en CustomersPage: solo Administrador
router.get(
  "/customer/:customerId/latest",
  protect,
  restrictTo("Administrador"),
  getLatestAssessmentByCustomer,
);

// Botón "Ver más": historial completo, solo Administrador
router.get(
  "/customer/:customerId/history",
  protect,
  restrictTo("Administrador"),
  getAssessmentHistoryByCustomer,
);

// Acceso para llenar el expediente de una cita específica
// (Administrador siempre; Colaborador solo si la cita es suya y no está bloqueada)
router.get(
  "/appointment/:appointmentId",
  protect,
  canAttendAppointment,
  getAssessmentByAppointment,
);

router.post(
  "/appointment/:appointmentId",
  protect,
  canAttendAppointment,
  createAssessment,
);

export default router;
