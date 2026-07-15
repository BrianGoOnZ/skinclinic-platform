import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

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

// Verifica que el usuario pueda atender clínicamente una cita específica:
// - Administrador: acceso total, sin restricciones.
// - Colaborador: solo si la cita es suya Y el expediente asociado (si existe)
//   no está ya bloqueado por haberse guardado antes.
export const canAttendAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByPk(appointmentId, {
      include: ["medicalAssessment", "laserAssessment"],
    });

    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    if (req.user.role === "Administrador") {
      req.appointment = appointment;
      return next();
    }

    if (appointment.userId !== req.user.id) {
      return res.status(403).json({
        message: "Esta cita no está asignada a tu usuario",
      });
    }

    const existingAssessment =
      appointment.marca === "Modelha DK"
        ? appointment.medicalAssessment
        : appointment.laserAssessment;

    if (existingAssessment?.lockedForCollaborator) {
      return res.status(403).json({
        message: "Este expediente ya fue guardado y no puede volver a abrirse",
      });
    }

    req.appointment = appointment;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Error al validar el acceso a la cita",
      error: error.message,
    });
  }
};
