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
      allowNull: true,
      unique: true,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "birth",
    },
    gender: {
      type: DataTypes.ENUM("H", "M", "ND"),
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
    createdAt: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "Customers",
    timestamps: false,
  },
);

export default Customer;
