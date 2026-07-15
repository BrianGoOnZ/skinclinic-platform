import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const DailySkincareRoutine = sequelize.define(
  "DailySkincareRoutine",
  {
    routineId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "routine_id",
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "assessment_id",
    },
    dayCleanser: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "day_cleanser",
    },
    dayMoisturizer: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "day_moisturizer",
    },
    daySunscreen: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "day_sunscreen",
    },
    dayExfoliator: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "day_exfoliator",
    },
    dayToner: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "day_toner",
    },
    daySerum: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "day_serum",
    },
    dayOther: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "day_other",
    },
    nightCleanser: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "night_cleanser",
    },
    nightMoisturizer: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "night_moisturizer",
    },
    nightToner: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "night_toner",
    },
    nightEyeCream: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "night_eye_cream",
    },
    nightMakeupRemover: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "night_makeup_remover",
    },
    nightExfoliator: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "night_exfoliator",
    },
    nightOther: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "night_other",
    },
  },
  {
    tableName: "Daily_Skincare_Routines",
    timestamps: false,
  },
);

export default DailySkincareRoutine;
