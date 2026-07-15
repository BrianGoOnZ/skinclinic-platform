import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ModelhaEvolutionLog = sequelize.define(
  "ModelhaEvolutionLog",
  {
    logId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "log_id",
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "assessment_id",
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "appointment_id",
    },
    sessionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "session_number",
    },
    treatmentDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "treatment_description",
    },
  },
  {
    tableName: "Modelha_Evolution_Logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default ModelhaEvolutionLog;
