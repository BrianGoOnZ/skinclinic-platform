import Appointment from "../models/Appointment.js";
import Customer from "../models/Customer.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

const appointmentIncludes = [
  {
    model: Customer,
    as: "customer",
    attributes: ["customerId", "name", "phone"],
  },
  { model: Service, as: "service", attributes: ["serviceId", "name", "brand"] },
  { model: User, as: "collaborator", attributes: ["id", "name"] },
];

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: appointmentIncludes,
      order: [["startTime", "ASC"]],
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching appointments",
      error: error.message,
    });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { customerId, serviceId, userId, marca, startTime, endTime } =
      req.body;

    if (!customerId || !serviceId || !marca || !startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "Faltan campos requeridos para agendar la cita" });
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return res
        .status(400)
        .json({
          message: "La hora de fin debe ser posterior a la hora de inicio",
        });
    }

    const newAppointment = await Appointment.create({
      customerId,
      serviceId,
      userId: userId || null,
      marca,
      startTime,
      endTime,
    });

    const fullAppointment = await Appointment.findByPk(
      newAppointment.appointmentId,
      {
        include: appointmentIncludes,
      },
    );

    res.status(201).json(fullAppointment);
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating appointment",
      error: error.message,
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    const { startTime, endTime } = req.body;
    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      return res
        .status(400)
        .json({
          message: "La hora de fin debe ser posterior a la hora de inicio",
        });
    }

    await appointment.update(req.body);

    const updated = await Appointment.findByPk(id, {
      include: appointmentIncludes,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating appointment",
      error: error.message,
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["Pendiente", "Confirmada", "Asistio", "Cancelada"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    await appointment.update({ status });
    res.status(200).json({ message: "Estado actualizado", status });
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating status",
      error: error.message,
    });
  }
};
