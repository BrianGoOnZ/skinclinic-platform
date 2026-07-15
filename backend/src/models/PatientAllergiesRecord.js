import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PatientAllergiesRecord = sequelize.define(
  "PatientAllergiesRecord",
  {
    allergyRecordId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "allergy_record_id",
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "assessment_id",
    },
    allergyFood: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "allergy_food",
    },
    allergyMedication: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "allergy_medication",
    },
    allergyMaterial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "allergy_material",
    },
    allergyProductIngredient: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "allergy_product_ingredient",
    },
    allergyObjectAnimal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "allergy_object_animal",
    },
    hasDermographism: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "has_dermographism",
    },
    hasSunRedness: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "has_sun_redness",
    },
    hasPetsAtHome: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "has_pets_at_home",
    },
    hasStressReaction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "has_stress_reaction",
    },
    allergyDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "allergy_details",
    },
  },
  {
    tableName: "Patient_Allergies_Records",
    timestamps: false,
  },
);

export default PatientAllergiesRecord;
