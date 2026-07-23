import { sendAppointmentConfirmationTemplate } from "./src/services/whatsappService.js"; // Ajusta la ruta si es necesario

async function probarEnvio() {
  try {
    console.log("Enviando mensaje de prueba...");

    const messageId = await sendAppointmentConfirmationTemplate({
      phone: "6695054567", // Tu número real
      customerName: "Brian", // Variable {{1}}
      serviceName: "Facial", // Variable {{2}}
      dateLabel: "24 de julio", // Variable {{3}}
      timeLabel: "6:00 AM", // Variable {{4}}
    });

    console.log("¡Mensaje enviado con éxito! ID:", messageId);
  } catch (error) {
    console.error(
      "Error al enviar el mensaje:",
      error.response?.data || error.message,
    );
  }
}

probarEnvio();
