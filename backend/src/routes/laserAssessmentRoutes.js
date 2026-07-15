import express from "express";
import {
  getLatestLaserAssessmentByCustomer,
  getLaserAssessmentHistoryByCustomer,
  getLaserAssessmentByAppointment,
  createLaserAssessment,
} from "../controllers/laserAssessmentController.js";
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
  getLatestLaserAssessmentByCustomer,
);

router.get(
  "/customer/:customerId/history",
  protect,
  restrictTo("Administrador"),
  getLaserAssessmentHistoryByCustomer,
);

router.get(
  "/appointment/:appointmentId",
  protect,
  canAttendAppointment,
  getLaserAssessmentByAppointment,
);

router.post(
  "/appointment/:appointmentId",
  protect,
  canAttendAppointment,
  createLaserAssessment,
);

export default router;
