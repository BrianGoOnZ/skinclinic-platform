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

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
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
