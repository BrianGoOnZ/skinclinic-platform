import rateLimit from "express-rate-limit";

// Limitador de intentos para evitar ataques de fuerza bruta en el Login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos de bloqueo
  max: 5, // Máximo 5 intentos por IP en ese lapso
  message: {
    message:
      "Demasiados intentos fallidos. Por seguridad, intente de nuevo en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
