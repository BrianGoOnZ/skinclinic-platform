import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PatientDietRating = sequelize.define(
  "PatientDietRating",
  {
    dietRatingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "diet_rating_id",
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "assessment_id",
    },
    foodItem: {
      type: DataTypes.ENUM(
        "refrescos",
        "bebidas_energizantes",
        "cafe",
        "alcohol",
        "pan_dulce_azucar",
        "frituras",
        "comida_picante",
        "lacteos",
        "proteina_gimnasio",
        "carnes_rojas",
        "vegetales",
        "almendras_nueces",
        "frutas",
        "tabaco_vape",
        "cannabis_drogas",
        "litros_agua_diarios",
      ),
      allowNull: false,
      field: "food_item",
    },
    ratingValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "rating_value",
    },
  },
  {
    tableName: "Patient_Diet_Ratings",
    timestamps: false,
  },
);

export default PatientDietRating;
