import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Customer = sequelize.define(
  "Customer",
  {
    customerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "customer_id",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true, // VARCHAR(100) UNIQUE NULL
      unique: true,
    },
    birthdate: {
      type: DataTypes.DATEONLY, // birth DATE NOT NULL
      allowNull: false,
      field: "birth",
    },
    gender: {
      type: DataTypes.ENUM("H", "M", "ND"), // ENUM('H', 'M', 'ND') NOT NULL
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    emergencyContactName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "emergency_contact_name",
    },
    emergencyContactPhone: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "emergency_contact_phone",
    },
    medicalInsuranceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      field: "medical_insurance_number",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    tableName: "Customers", // Nombre exacto de tu tabla SQL
    timestamps: false, // Tu SQL solo tiene created_at manual, desactivamos timestamps automáticos de Sequelize
  },
);

export default Customer;
