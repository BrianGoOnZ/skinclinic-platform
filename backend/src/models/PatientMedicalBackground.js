import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const boolField = (fieldName) => ({
  type: DataTypes.BOOLEAN,
  defaultValue: false,
  field: fieldName,
});

const PatientMedicalBackground = sequelize.define(
  "PatientMedicalBackground",
  {
    backgroundId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "background_id",
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "assessment_id",
    },
    hasDiabetes: boolField("has_diabetes"),
    hasHyperthyroidism: boolField("has_hyperthyroidism"),
    hasHypothyroidism: boolField("has_hypothyroidism"),
    hasPolicysticOvary: boolField("has_policystic_ovary"),
    hasHeartFailure: boolField("has_heart_failure"),
    hasHypertensionHypotension: boolField("has_hypertension_hypotension"),
    hasHighCholesterol: boolField("has_high_cholesterol"),
    hasThrombosis: boolField("has_thrombosis"),
    hasEpilepsy: boolField("has_epilepsy"),
    hasMigraine: boolField("has_migraine"),
    hasConvulsions: boolField("has_convulsions"),
    hasPhobias: boolField("has_phobias"),
    hasDepression: boolField("has_depression"),
    hasAnxiety: boolField("has_anxiety"),
    hasGastritis: boolField("has_gastritis"),
    hasIrritableColon: boolField("has_irritable_colon"),
    hasDigestiveDisconforts: boolField("has_digestive_disconforts"),
    hasKidneyDiseases: boolField("has_kidney_diseases"),
    hasCancerHistory: boolField("has_cancer_history"),
    hasHivAids: boolField("has_hiv_aids"),
    hasHepatitis: boolField("has_hepatitis"),
    hasHerpes: boolField("has_herpes"),
    hasFever: boolField("has_fever"),
    hasBodyHeadPain: boolField("has_body_head_pain"),
    hasThroatInflammation: boolField("has_throat_inflammation"),
    hasVomitingNausea: boolField("has_vomiting_nausea"),
    hasEyeDiseases: boolField("has_eye_diseases"),
    hasContactLentes: boolField("has_contact_lentes"),
    hasEyelashExtensions: boolField("has_eyelash_extensions"),
    hasPacemaker: boolField("has_pacemaker"),
    hasMetalPlates: boolField("has_metal_plates"),
    hasImplants: boolField("has_implants"),
    hasEstheticFillers: boolField("has_esthetic_fillers"),
    hasSurgeries: boolField("has_surgeries"),
    hasFractures: boolField("has_fractures"),
    hasMedications: boolField("has_medications"),
    hasPregnancyLactation: boolField("has_pregnancy_lactation"),
    medicalObservations: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "medical_observations",
    },
  },
  {
    tableName: "Patient_Medical_Backgrounds",
    timestamps: false,
  },
);

export default PatientMedicalBackground;
