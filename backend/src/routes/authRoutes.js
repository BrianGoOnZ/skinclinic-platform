import express from "express";
import {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
  reactivateUser,
  changePassword,
  getMe,
  logout,
  refreshToken,
} from "../controllers/authController.js";
import { protect, restrictTo } from "../middlewares/auth.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario (Administrador o Colaborador)
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: brian@skinclinic.com
 *               password:
 *                 type: string
 *                 example: Temporal123
 *     responses:
 *       200:
 *         description: Login exitoso, cookies de sesión establecidas
 *       401:
 *         description: Credenciales inválidas o cuenta inactiva
 *       429:
 *         description: Demasiados intentos fallidos (rate limit)
 */

router.post("/login", loginLimiter, login);
router.post("/refresh", refreshToken);

// Rutas autenticadas de sesión
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtiene los datos de la sesión actual
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *       401:
 *         description: No autorizado, token expirado o inválido
 */
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.post("/change-password", protect, changePassword);

// Solo la Administradora gestiona colaboradores
router.post("/register", protect, restrictTo("Administrador"), register);
router.get("/usuarios", protect, restrictTo("Administrador"), getAllUsers);
router.get("/usuarios/:id", protect, restrictTo("Administrador"), getUserById);
router.put("/usuarios/:id", protect, restrictTo("Administrador"), updateUser);
router.patch(
  "/usuarios/:id/delete",
  protect,
  restrictTo("Administrador"),
  deactivateUser,
);
router.patch(
  "/usuarios/:id/reactivate",
  protect,
  restrictTo("Administrador"),
  reactivateUser,
);

// Verificación de roles para pruebas
router.get("/dashboard-general", protect, (req, res) => {
  res
    .status(200)
    .json({ message: "Access granted to general dashboard. Token is valid!" });
});

router.get("/admin-only", protect, restrictTo("Administrador"), (req, res) => {
  res
    .status(200)
    .json({ message: "Access granted. Welcome to the admin panel!" });
});

export default router;
