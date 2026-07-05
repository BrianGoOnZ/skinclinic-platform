import express from "express";
import { getAllServices } from "../controllers/serviceController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getAllServices);

export default router;
