import express from "express";
import {
  getLatestAssessmentByCustomer,
  getAssessmentHistoryByCustomer,
  getAssessmentByAppointment,
  createAssessment,
  getAllAssessments,
  getAssessmentById,
} from "../controllers/assessmentController.js";
import {
  protect,
  restrictTo,
  canAttendAppointment,
} from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/customer/:customerId/latest",
  protect,
  restrictTo("Administrador"),
  getLatestAssessmentByCustomer,
);

router.get(
  "/customer/:customerId/history",
  protect,
  restrictTo("Administrador"),
  getAssessmentHistoryByCustomer,
);

router.get("/all", protect, restrictTo("Administrador"), getAllAssessments);

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

router.get("/:id", protect, restrictTo("Administrador"), getAssessmentById);

export default router;
