import jwt from "jsonwebtoken";

// ============================================================================
// SECCIÓN 1: GENERACIÓN DE TOKENS (Para usar en el Login)
// ============================================================================

// Generar Access Token (Corta duración: 15 min)
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );
};

// Generar Refresh Token (Larga duración: 1 day)
export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1d",
  });
};

// ============================================================================
// SECCIÓN 2: MIDDLEWARES DE PROTECCIÓN (Policías de Tráfico - RBAC)
// ============================================================================

// Intercepta la petición y valida que el usuario esté logueado mediante su cookie
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // Inyecta id y role en la petición
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
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
