import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generar Access Token (Corta duración: 15 min)
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );
};

// Generar Refresh Token (Larga duración: 8h)
export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "8h",
  });
};

// Intercepta la petición y valida que el usuario esté logueado mediante su cookie
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "role", "isActive"],
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Account inactive or not found" });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token expired or invalid",
      error: error.message,
    });
  }
};

// Restringe el acceso solo a los roles permitidos (Admin / Collaborator)
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};
