import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Service = sequelize.define(
  "Service",
  {
    serviceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "service_id",
    },
    brand: {
      type: DataTypes.ENUM("Modelha DK", "Depilclinik"),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    suggestedFrequency: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "suggested_frequency",
    },
    regularPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "regular_price",
    },
    promoPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "promo_price",
    },
    requiresAssessment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "requires_assessment",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    tableName: "Services",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default Service;
