import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SalePayment = sequelize.define(
  "SalePayment",
  {
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "payment_id",
    },
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "sale_id",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("Efectivo", "Tarjeta", "Transferencia"),
      allowNull: false,
      field: "payment_method",
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "paid_at",
    },
    registeredByUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "registered_by_user_id",
    },
  },
  {
    tableName: "Sale_Payments",
    timestamps: false,
  },
);

export default SalePayment;
