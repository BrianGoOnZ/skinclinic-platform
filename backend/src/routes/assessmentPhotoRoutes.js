import express from "express";
import {
  uploadAssessmentPhoto,
  getPhotosByAssessment,
} from "../controllers/assessmentPhotoController.js";
import { protect } from "../middlewares/auth.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/", protect, getPhotosByAssessment);

router.patch(
  "/:photoId",
  protect,
  upload.single("photo"),
  uploadAssessmentPhoto,
);

export default router;
