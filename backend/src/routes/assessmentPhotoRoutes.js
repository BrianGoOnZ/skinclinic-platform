import express from "express";
import {
  uploadAssessmentPhoto,
  getPhotosByAssessment,
} from "../controllers/assessmentPhotoController.js";
import { protect } from "../middlewares/auth.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Lista las 5 fotos (subidas o pendientes) de un expediente
// Ej: GET /api/assessment-photos?assessmentId=12
//     GET /api/assessment-photos?laserAssessmentId=7
router.get("/", protect, getPhotosByAssessment);

// Sube/actualiza una foto puntual por su photoId
+router.patch(
  "/:photoId",
  protect,
  upload.single("photo"),
  uploadAssessmentPhoto,
);

export default router;
