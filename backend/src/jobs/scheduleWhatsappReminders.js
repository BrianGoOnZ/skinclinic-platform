import cron from "node-cron";
import { Op } from "sequelize";
import Appointment from "../models/Appointment.js";
import Customer from "../models/Customer.js";
import Service from "../models/Service.js";
import WhatsappNotification from "../models/WhatsappNotification.js";
import { whatsappQueue } from "../queues/whatsappQueue.js";

const formatDateLabel = (date) =>
  new Date(date).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
  });

const formatTimeLabel = (date) =>
  new Date(date).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const startWhatsappScheduler = () => {
  // Corre cada 15 minutos
  cron.schedule("*/15 * * * *", async () => {
    try {
      const now = new Date();
      const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
      const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

      const appointments = await Appointment.findAll({
        where: {
          startTime: { [Op.between]: [windowStart, windowEnd] },
          status: { [Op.notIn]: ["Cancelada", "Completada"] },
        },
        include: [
          { model: Customer, as: "customer" },
          { model: Service, as: "service" },
          { model: WhatsappNotification, as: "whatsappNotification" },
        ],
      });

      for (const appt of appointments) {
        if (appt.whatsappNotification || !appt.customer?.phone) continue;

        const notification = await WhatsappNotification.create({
          appointmentId: appt.appointmentId,
          customerPhone: appt.customer.phone,
          status: "Pendiente",
        });

        await whatsappQueue.add("send-reminder", {
          notificationId: notification.notificationId,
          phone: appt.customer.phone,
          customerName: appt.customer.name,
          serviceName: appt.service?.name || "tu servicio",
          dateLabel: formatDateLabel(appt.startTime),
          timeLabel: formatTimeLabel(appt.startTime),
        });
      }
    } catch (error) {
      console.error("Error en scheduler de WhatsApp:", error.message);
    }
  });

  console.log("Scheduler de recordatorios de WhatsApp iniciado.");
};
