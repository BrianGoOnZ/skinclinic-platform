import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const LaserEvolutionLog = sequelize.define(
  "LaserEvolutionLog",
  {
    logId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "log_id",
    },
    laserAssessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "laser_assessment_id",
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
    laserBrandModel: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "laser_brand_model",
    },
    evolutionNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "evolution_notes",
    },
  },
  {
    tableName: "Laser_Evolution_Logs",
    timestamps: false,
  },
);

export default LaserEvolutionLog;
