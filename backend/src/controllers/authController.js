import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth.js";

// 1. Registro de Usuarios (Sincronizado con las columnas de tu SQL)
export const register = async (req, res) => {
  try {
    // Extraemos TODAS las variables obligatorias que mandas desde Postman
    const { name, email, password, phone, gender, role } = req.body;

    // Verificar si el correo ya existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Pasamos todas las variables requeridas a Sequelize
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      gender,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
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

    // Buscamos validando que la cuenta esté activa (is_active mapeado como isActive)
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

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, role: user.role },
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
    // Usamos los campos idénticos a las columnas reales de tu CREATE TABLE Users
    const usuarios = await User.findAll({
      attributes: ["user_id", "name", "email", "rol", "is_active"],
      order: [["name", "ASC"]],
    });

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al consultar usuarios en MySQL:", error);
    return res.status(500).json({
      message: "Error interno del servidor al obtener colaboradores",
    });
  }
};
