import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AssessmentProfessionalTreatment = sequelize.define(
  "AssessmentProfessionalTreatment",
  {
    assessmentTreatmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "assessment_treatment_id",
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "assessment_id",
    },
    professionalType: {
      type: DataTypes.ENUM(
        "dermatologo",
        "ginecologo",
        "endocrinologo",
        "psicologo_psiquiatra",
        "medico_estetico",
        "cirujano_plastico",
        "cosmetologo",
        "fisioterapeuta",
        "nutriologo",
        "otro",
      ),
      allowNull: false,
      field: "professional_type",
    },
    treatmentDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "treatment_details",
    },
  },
  {
    tableName: "assessment_professional_treatments",
    timestamps: false,
  },
);

export default AssessmentProfessionalTreatment;
