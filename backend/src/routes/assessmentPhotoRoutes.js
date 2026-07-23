// backend/src/routes/assessmentPhotoRoutes.js
import express from "express";
import {
  uploadAssessmentPhoto,
  getPhotosByAssessment,
} from "../controllers/assessmentPhotoController.js";
import { protect } from "../middlewares/auth.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB antes de comprimir
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten archivos de imagen"));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.get("/", protect, getPhotosByAssessment);

router.patch(
  "/:photoId",
  protect,
  upload.single("photo"),
  uploadAssessmentPhoto,
);

export default router;
