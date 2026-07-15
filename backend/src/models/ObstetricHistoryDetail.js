import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ObstetricHistoryDetail = sequelize.define(
  "ObstetricHistoryDetail",
  {
    obstetricDetailId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "obstetric_detail_id",
    },
    gynecoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "gyneco_id",
    },
    conditionStatus: {
      type: DataTypes.ENUM("Embarazo", "Aborto", "Lactancia"),
      allowNull: false,
      field: "condition_status",
    },
    countValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "count_value",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Obstetric_History_Details",
    timestamps: false,
  },
);

export default ObstetricHistoryDetail;
