import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const LaserAreaOfInterest = sequelize.define(
  "LaserAreaOfInterest",
  {
    laserAreaInterestId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "laser_area_interest_id",
    },
    laserAssessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "laser_assessment_id",
    },
    areaName: {
      type: DataTypes.ENUM(
        "Extra Chicas",
        "Chicas",
        "Mediana",
        "Grande",
        "Full Body",
      ),
      allowNull: false,
      field: "area_name",
    },
  },
  {
    tableName: "Laser_Areas_Of_Interest",
    timestamps: false,
  },
);

export default LaserAreaOfInterest;
