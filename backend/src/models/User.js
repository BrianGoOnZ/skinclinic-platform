import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "user_id", // Mapea correctamente a user_id de la BD
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: false, // Requerido en tu SQL
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    birth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("H", "M", "ND"),
      allowNull: false, // Requerido en tu SQL
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    jobPosition: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "job_position",
    },
    emergencyContactName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "emergency_contact_name",
    },
    emergencyContactPhone: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "emergency_contact_phone",
    },
    medicalInsuranceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "medical_insurance_number",
    },
    role: {
      type: DataTypes.ENUM("Administrador", "Colaborador"),
      allowNull: false,
      defaultValue: "Colaborador",
      field: "rol", // Mapea a la columna 'rol' en español
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active", // Mapea a 'is_active' para la baja lógica
    },
  },
  {
    tableName: "Users", // Nota la 'U' mayúscula como en tu SQL
    timestamps: true,
    createdAt: "created_at", // Mapea al campo nativo de tu SQL
    updatedAt: false, // Tu SQL no tiene updated_at, lo desactivamos para evitar errores
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;
