import express from "express";
import {
  getTodaySummary,
  getTopTreatments,
  getCollaboratorPerformance,
  getUpcomingAppointments,
  getMyTodayAppointments,
  getMyMonthlyCount,
  getMyUpcomingAppointments,
  getMyPendingAssessments,
} from "../controllers/dashboardController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/today-summary", protect, getTodaySummary);
router.get("/top-treatments", protect, getTopTreatments);
router.get("/collaborator-performance", protect, getCollaboratorPerformance);
router.get("/upcoming-appointments", protect, getUpcomingAppointments);

router.get("/my-today-appointments", protect, getMyTodayAppointments);
router.get("/my-monthly-count", protect, getMyMonthlyCount);
router.get("/my-upcoming-appointments", protect, getMyUpcomingAppointments);
router.get("/my-pending-assessments", protect, getMyPendingAssessments);

export default router;
