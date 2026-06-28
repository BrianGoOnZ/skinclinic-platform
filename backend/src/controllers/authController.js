import crypto from "crypto";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth.js";

// Registro de Usuarios (Expediente completo + Contraseña Temporal)
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      role,
      birth,
      address,
      jobPosition,
      emergencyContactName,
      emergencyContactPhone,
      medicalInsuranceNumber,
    } = req.body;

    // Verificar si el correo ya existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // GENERACIÓN DE CONTRASEÑA TEMPORAL
    const temporaryPassword = crypto.randomBytes(5).toString("hex");

    // Pasamos todas las variables requeridas y opcionales a Sequelize
    const newUser = await User.create({
      name,
      email,
      password: temporaryPassword,
      phone,
      gender,
      role,
      birth,
      address,
      jobPosition,
      emergencyContactName,
      emergencyContactPhone,
      medicalInsuranceNumber,
      mustChangePassword: true, // Forzamos que sea true, aunque ya es su default
    });

    // IMPORTANTE: Devolvemos la contraseña temporal en la respuesta
    // Solo se verá esta vez en pantalla para que el administrador se la dé al colaborador
    res.status(201).json({
      message: "User registered successfully",
      temporaryPassword, // <--- ¡Ojo aquí para copiarla en Postman!
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        mustChangePassword: newUser.mustChangePassword,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// 2. Login Seguro con Cookies HTTPOnly
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos validando que la cuenta esté activa
    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or inactive account" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Agregamos mustChangePassword a la respuesta del login para que el Frontend sepa si desviarlo o no
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

// Obtener todos los colaboradores para la pantalla del Frontend
export const getAllUsers = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: [
        ["user_id", "user_id"],
        "name",
        "email",
        ["rol", "rol"],
        ["is_active", "is_active"],
        ["job_position", "jobPosition"],
        ["must_change_password", "mustChangePassword"],
      ],
      order: [["name", "ASC"]],
    });

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al consultar usuarios en MySQL:", error);
    return res.status(500).json({
      message: "Error interno del servidor al obtener colaboradores",
      error: error.message,
    });
  }
};

// Actualizar la contraseña temporal por la definitiva (Primer Login)
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    // El middleware 'protect' inyecta al usuario autenticado en req.user
    // Revisando tu login, el ID se almacena directamente en user.id
    const userId = req.user?.id;

    if (!newPassword) {
      return res
        .status(400)
        .json({ message: "La nueva contraseña es requerida" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Buscamos al usuario por su ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizamos la contraseña (aquí el modelo User se encargará de pasarla por bcrypt automáticamente si tienes el hook seteado en tu modelo)
    user.password = newPassword;
    user.mustChangePassword = false; // Desactivamos el bloqueo

    await user.save();

    res.status(200).json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("Error en changePassword:", error);
    res.status(500).json({
      message: "Error interno del servidor al actualizar la contraseña",
      error: error.message,
    });
  }
};
