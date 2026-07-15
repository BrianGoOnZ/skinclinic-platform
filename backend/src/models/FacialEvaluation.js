import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const boolField = (fieldName) => ({
  type: DataTypes.BOOLEAN,
  defaultValue: false,
  field: fieldName,
});

const FacialEvaluation = sequelize.define(
  "FacialEvaluation",
  {
    facialEvalId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "facial_eval_id",
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "assessment_id",
    },
    skinAge: {
      type: DataTypes.ENUM("Joven", "Madura"),
      allowNull: true,
      field: "skin_age",
    },

    affectionInflammation: boolField("affection_inflammation"),
    affectionAcne: boolField("affection_acne"),
    affectionSpots: boolField("affection_spots"),
    affectionRosacea: boolField("affection_rosacea"),
    affectionSensitivity: boolField("affection_sensitivity"),
    affectionAging: boolField("affection_aging"),
    affectionFlaccidity: boolField("affection_flaccidity"),
    affectionPhotoaging: boolField("affection_photoaging"),

    secretionType: {
      type: DataTypes.ENUM("Seca", "Grasa", "Mixta"),
      allowNull: true,
      field: "secretion_type",
    },
    phototype: {
      type: DataTypes.ENUM("I", "II", "III", "IV", "V"),
      allowNull: true,
      field: "phototype",
    },

    primaryEphelides: boolField("primary_ephelides"),
    primaryMacules: boolField("primary_macules"),
    primaryLentigos: boolField("primary_lentigos"),
    primaryComedones: boolField("primary_comedones"),
    primaryMilliums: boolField("primary_milliums"),
    primaryVesicles: boolField("primary_vesicles"),
    primaryPapules: boolField("primary_papules"),
    primaryPustules: boolField("primary_pustules"),
    primaryScales: boolField("primary_scales"),
    primaryCysts: boolField("primary_cysts"),

    secondaryScars: boolField("secondary_scars"),
    secondaryCrusts: boolField("secondary_crusts"),
    secondaryNodules: boolField("secondary_nodules"),
    secondaryTubercle: boolField("secondary_tubercle"),
    secondaryMarks: boolField("secondary_marks"),
    secondaryUlcers: boolField("secondary_ulcers"),
    secondaryErythrosis: boolField("secondary_erythrosis"),
    secondaryPustules: boolField("secondary_pustules"),
    secondaryScales: boolField("secondary_scales"),
    secondaryCysts: boolField("secondary_cysts"),

    pigmentationMelasma: boolField("pigmentation_melasma"),
    pigmentationLentigos: boolField("pigmentation_lentigos"),
    pigmentationPostInflammatory: boolField("pigmentation_post_inflammatory"),
    pigmentationAchromia: boolField("pigmentation_achromia"),
    pigmentationVitiligo: boolField("pigmentation_vitiligo"),
    pigmentationOther: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "pigmentation_other",
    },

    vascularErythema: boolField("vascular_erythema"),
    vascularErythrosis: boolField("vascular_erythrosis"),
    vascularTelangiectasias: boolField("vascular_telangiectasias"),
    vascularCouperose: boolField("vascular_couperose"),
    vascularAngiomas: boolField("vascular_angiomas"),
    vascularOther: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "vascular_other",
    },

    agingFurrows: boolField("aging_furrows"),
    agingWrinkles: boolField("aging_wrinkles"),
    agingExpressionLines: boolField("aging_expression_lines"),
    agingFlaccidity: boolField("aging_flaccidity"),
    agingAngiomas: boolField("aging_angiomas"),
    agingOther: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "aging_other",
    },

    glogauScale: {
      type: DataTypes.ENUM("I", "II", "III", "IV"),
      allowNull: true,
      field: "glogau_scale",
    },
    glogauObservations: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "glogau_observations",
    },
    facialNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "facial_notes",
    },
  },
  {
    tableName: "Facial_Evaluations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default FacialEvaluation;
