import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PatientSkinPractice = sequelize.define(
  "PatientSkinPractice",
  {
    practiceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "practice_id",
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "assessment_id",
    },
    substanceType: {
      type: DataTypes.ENUM(
        "hidroquinona",
        "barmicil",
        "corticoides",
        "remedios_caseros",
        "otro",
      ),
      allowNull: false,
      field: "substance_type",
    },
    aplicationDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "aplication_details",
    },
  },
  {
    tableName: "Patient_Skin_Practices",
    timestamps: false,
  },
);

export default PatientSkinPractice;
