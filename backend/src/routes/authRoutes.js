import express from "express";
import { register, login, getAllUsers } from "../controllers/authController.js";
import { protect, restrictTo } from "../middlewares/auth.js";

const router = express.Router();

// Endpoints públicos de autenticación
router.post("/register", register);
router.post("/login", login);
router.get("/usuarios", protect, getAllUsers);

// ENDPOINTS DE PRUEBA DE SEGURIDAD (Rutas Protegidas)

// Ruta protegida general: Cualquier usuario logueado puede entrar
router.get("/dashboard-general", protect, (req, res) => {
  res.status(200).json({
    message: "Access granted to general dashboard. Token is valid!",
  });
});

// Ruta con restricción de rol: SÓLO usuarios con rol 'Administrador' pueden entrar
router.get("/admin-only", protect, restrictTo("Administrador"), (req, res) => {
  res.status(200).json({
    message: "Access granted. Welcome to the admin panel!",
  });
});

export default router;
