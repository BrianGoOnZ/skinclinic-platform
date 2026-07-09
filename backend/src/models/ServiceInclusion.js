import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ServiceInclusion = sequelize.define(
  "ServiceInclusion",
  {
    inclusionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "inclusion_id",
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "service_id",
    },
    itemName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "item_name",
    },
  },
  {
    tableName: "Service_inclusions",
    timestamps: false,
  },
);

export default ServiceInclusion;
