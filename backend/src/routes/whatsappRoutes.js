import express from "express";
import {
  verifyWebhook,
  receiveWebhook,
  getAllNotifications,
  resendNotification,
} from "../controllers/whatsappController.js";
import { protect, restrictTo } from "../middlewares/auth.js";

const router = express.Router();

// El webhook NO lleva `protect` — Meta no manda tus cookies de sesión.
// La seguridad aquí es el verify_token (GET) y que solo tú conoces la URL.
router.get("/webhook", verifyWebhook);
router.post("/webhook", receiveWebhook);

router.get("/", protect, restrictTo("Administrador"), getAllNotifications);
router.post(
  "/:id/resend",
  protect,
  restrictTo("Administrador"),
  resendNotification,
);

export default router;
