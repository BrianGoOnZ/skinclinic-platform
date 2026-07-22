import { Op } from "sequelize";
import WhatsappNotification from "../models/WhatsappNotification.js";
import Appointment from "../models/Appointment.js";
import Customer from "../models/Customer.js";
import Service from "../models/Service.js";
import { whatsappQueue } from "../queues/whatsappQueue.js";

const notificationIncludes = [
  {
    model: Appointment,
    as: "appointment",
    attributes: ["appointmentId", "startTime", "status"],
    include: [
      { model: Customer, as: "customer", attributes: ["name", "phone"] },
      { model: Service, as: "service", attributes: ["name", "brand"] },
    ],
  },
];

// Verificación del webhook (Meta hace un GET una sola vez al configurarlo)
export const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
  ) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

// Recibe eventos de estado (entregado/leído) y respuestas de botones
export const receiveWebhook = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0]?.value;

    // 1. Actualizaciones de estado (sent/delivered/read)
    if (change?.statuses?.length) {
      for (const statusEvent of change.statuses) {
        const notification = await WhatsappNotification.findOne({
          where: { whatsappMessageId: statusEvent.id },
        });
        if (!notification) continue;

        if (statusEvent.status === "delivered") {
          await notification.update({
            status: "Entregado",
            deliveredAt: new Date(Number(statusEvent.timestamp) * 1000),
          });
        } else if (statusEvent.status === "read") {
          await notification.update({
            status: "Leido",
            readAt: new Date(Number(statusEvent.timestamp) * 1000),
          });
        } else if (statusEvent.status === "failed") {
          const errMsg = statusEvent.errors?.[0]?.title || "Fallo de entrega";
          await notification.update({
            status: "Fallido",
            errorMessage: errMsg,
          });
        }
      }
    }

    // 2. Respuestas del cliente (botón Confirmar / Cancelar)
    if (change?.messages?.length) {
      for (const msg of change.messages) {
        const originalWamid = msg.context?.id;
        if (!originalWamid) continue;

        const notification = await WhatsappNotification.findOne({
          where: { whatsappMessageId: originalWamid },
          include: [{ model: Appointment, as: "appointment" }],
        });
        if (!notification) continue;

        const buttonText = msg.button?.text?.toLowerCase() || "";

        if (buttonText.includes("confirmar")) {
          await notification.update({
            status: "Confirmada",
            respondedAt: new Date(),
          });
          await Appointment.update(
            { status: "Confirmada" },
            { where: { appointmentId: notification.appointmentId } },
          );
        } else if (buttonText.includes("cancelar")) {
          await notification.update({
            status: "Cancelada_Cliente",
            respondedAt: new Date(),
          });
          await Appointment.update(
            { status: "Cancelada" },
            { where: { appointmentId: notification.appointmentId } },
          );
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error procesando webhook de WhatsApp:", error.message);
    res.sendStatus(200); // Meta reintenta si no regresas 200
  }
};

// Listado para el panel de administración
export const getAllNotifications = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.status = status;

    const notifications = await WhatsappNotification.findAll({
      where,
      include: notificationIncludes,
      order: [["created_at", "DESC"]],
    });

    const filtered = search
      ? notifications.filter((n) =>
          n.appointment?.customer?.name
            ?.toLowerCase()
            .includes(search.toLowerCase()),
        )
      : notifications;

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las notificaciones de WhatsApp",
      error: error.message,
    });
  }
};

// Reenvío manual (botón en el panel)
export const resendNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await WhatsappNotification.findByPk(id, {
      include: notificationIncludes,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    const appt = notification.appointment;
    if (!appt) {
      return res.status(400).json({ message: "La cita asociada ya no existe" });
    }

    await notification.update({ status: "Pendiente" });

    await whatsappQueue.add("send-reminder", {
      notificationId: notification.notificationId,
      phone: appt.customer.phone,
      customerName: appt.customer.name,
      serviceName: appt.service?.name || "tu servicio",
      dateLabel: new Date(appt.startTime).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
      }),
      timeLabel: new Date(appt.startTime).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    res.status(200).json({ message: "Reenvío encolado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al reenviar la notificación",
      error: error.message,
    });
  }
};
