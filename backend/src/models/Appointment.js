import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Customer from "./Customer.js";
import Service from "./Service.js";
import User from "./User.js";

const Appointment = sequelize.define(
  "Appointment",
  {
    appointmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "appointment_id",
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "customer_id",
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "service_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "user_id",
    },
    marca: {
      type: DataTypes.ENUM("Modelha DK", "Depilclinik"),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_time",
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_time",
    },
    status: {
      type: DataTypes.ENUM(
        "Programada",
        "Confirmada",
        "En Tratamiento",
        "Completada",
        "Cancelada",
      ),
      allowNull: false,
      defaultValue: "Programada",
    },
  },
  {
    tableName: "Appointments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

Appointment.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
Appointment.belongsTo(Service, { foreignKey: "serviceId", as: "service" });
Appointment.belongsTo(User, { foreignKey: "userId", as: "collaborator" });

export default Appointment;
