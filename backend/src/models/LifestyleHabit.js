import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const LifestyleHabit = sequelize.define(
  "LifestyleHabit",
  {
    habitId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "habit_id",
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "assessment_id",
    },
    makeupFrequency: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "makeup_frequency",
    },
    washingFrequency: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "washing_frequency",
    },
    physicalActivityDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "physical_activity_details",
    },
    sleepTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: "sleep_time",
    },
    wakeTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: "wake_time",
    },
    stressLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "stress_level",
    },
    dayDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "day_description",
    },
  },
  {
    tableName: "Lifestyle_Habits",
    timestamps: false,
  },
);

export default LifestyleHabit;
