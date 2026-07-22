import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const WhatsappNotification = sequelize.define(
  "WhatsappNotification",
  {
    notificationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "notification_id",
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: "appointment_id",
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "customer_phone",
    },
    status: {
      type: DataTypes.ENUM(
        "Pendiente",
        "Enviado",
        "Entregado",
        "Leido",
        "Confirmada",
        "Cancelada_Cliente",
        "Sin_Respuesta",
        "Fallido",
      ),
      allowNull: false,
      defaultValue: "Pendiente",
    },
    whatsappMessageId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "whatsapp_message_id",
    },
    templateUsed: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "template_used",
    },
    sentAt: { type: DataTypes.DATE, allowNull: true, field: "sent_at" },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "delivered_at",
    },
    readAt: { type: DataTypes.DATE, allowNull: true, field: "read_at" },
    respondedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "responded_at",
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "error_message",
    },
    retryCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "retry_count",
    },
  },
  {
    tableName: "Whatsapp_Notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default WhatsappNotification;
