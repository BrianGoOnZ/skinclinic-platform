import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AssessmentPhoto = sequelize.define(
  "AssessmentPhoto",
  {
    photoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "photo_id",
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "assessment_id",
    },
    laserAssessmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "laser_assessment_id",
    },
    photoAngle: {
      type: DataTypes.ENUM(
        "Frente",
        "Perfil Derecho",
        "Perfil Izquierdo",
        "45 Grados",
        "135 Grados",
      ),
      allowNull: false,
      field: "photo_angle",
    },
    photoUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
      field: "photo_url",
    },
    isPending: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_pending",
    },
    uploadedByUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "uploaded_by_user_id",
    },
  },
  {
    tableName: "Assessment_Photos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default AssessmentPhoto;
