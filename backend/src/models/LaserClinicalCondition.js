import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const boolField = (fieldName) => ({
  type: DataTypes.BOOLEAN,
  defaultValue: false,
  field: fieldName,
});

const LaserClinicalCondition = sequelize.define(
  "LaserClinicalCondition",
  {
    conditionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "condition_id",
    },
    laserAssessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "laser_assessment_id",
    },
    hasAcne: boolField("has_acne"),
    hasSkinSpots: boolField("has_skin_spots"),
    hasVitiligo: boolField("has_vitiligo"),
    hasVaricoseVeins: boolField("has_varicose_veins"),
    hasRosacea: boolField("has_rosacea"),
    hasAlopecia: boolField("has_alopecia"),
    hasHirsutism: boolField("has_hirsutism"),
    hasPreviousShaving: boolField("has_previous_shaving"),
    hasWaxingHistory: boolField("has_waxing_history"),
    takesSupplements: boolField("takes_supplements"),
    usesContraceptives: boolField("uses_contraceptives"),
    hasPregnancies: boolField("has_pregnancies"),
    hasPcos: boolField("has_pcos"),
    gynecologicalOtherNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "gynecological_other_notes",
    },
  },
  {
    tableName: "Laser_Clinical_Conditions",
    timestamps: false,
  },
);

export default LaserClinicalCondition;
