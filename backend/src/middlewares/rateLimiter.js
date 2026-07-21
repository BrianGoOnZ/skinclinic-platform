import rateLimit from "express-rate-limit";

// Limitador de intentos para evitar ataques de fuerza bruta en el Login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // Si estamos en modo test (o puedes evaluar process.env.NODE_ENV), permitimos más intentos
  max: process.env.NODE_ENV === "test" ? 1000 : 5,
  message: {
    message:
      "Demasiados intentos fallidos. Por seguridad, intente de nuevo en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitador global para toda la API: protección básica ante ráfagas
// masivas de peticiones (DDoS simple, scraping, bots).
export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // ventana de 1 minuto
  max: 300, // máx 300 peticiones por IP por minuto
  message: {
    message: "Demasiadas solicitudes. Intenta de nuevo en un momento.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitador para endpoints de escritura pesada (crear citas, ventas, clientes)
// más estricto que el global, para frenar abuso dirigido a un endpoint específico.
export const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60, // máx 60 escrituras por IP por minuto
  message: {
    message: "Demasiadas solicitudes de escritura. Espera un momento.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
