import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SaleItem = sequelize.define(
  "SaleItem",
  {
    saleItemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "sale_item_id",
    },
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "sale_id",
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "service_id",
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "unit_price",
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      field: "discount_percent",
    },
  },
  {
    tableName: "Sale_Items",
    timestamps: false,
  },
);

export default SaleItem;
