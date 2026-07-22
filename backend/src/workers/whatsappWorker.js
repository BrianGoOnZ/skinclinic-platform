import { Worker } from "bullmq";
import queueRedisConnection from "../config/queueRedis.js";
import WhatsappNotification from "../models/WhatsappNotification.js";
import { sendAppointmentConfirmationTemplate } from "../services/whatsappService.js";

const whatsappWorker = new Worker(
  "whatsapp-reminders",
  async (job) => {
    const {
      notificationId,
      phone,
      customerName,
      serviceName,
      dateLabel,
      timeLabel,
    } = job.data;

    const notification = await WhatsappNotification.findByPk(notificationId);
    if (!notification) return;

    try {
      const wamid = await sendAppointmentConfirmationTemplate({
        phone,
        customerName,
        serviceName,
        dateLabel,
        timeLabel,
      });

      await notification.update({
        status: "Enviado",
        whatsappMessageId: wamid,
        templateUsed: process.env.WHATSAPP_TEMPLATE_NAME,
        sentAt: new Date(),
        errorMessage: null,
      });
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.message ||
        "Error desconocido";

      await notification.update({
        status: "Fallido",
        errorMessage: message,
        retryCount: notification.retryCount + 1,
      });

      throw error; // deja que BullMQ reintente según defaultJobOptions
    }
  },
  { connection: queueRedisConnection },
);

whatsappWorker.on("failed", (job, err) => {
  console.error(
    `Job de WhatsApp ${job.id} falló definitivamente:`,
    err.message,
  );
});

export default whatsappWorker;
