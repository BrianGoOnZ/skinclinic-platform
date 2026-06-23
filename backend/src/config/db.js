import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Evita saturar la consola con logs de SQL en desarrollo
    pool: {
      max: 5, // Máximo de conexiones simultáneas en el pool
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

export default sequelize;
