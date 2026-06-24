import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import sequelize from "./src/config/db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Estrategia de re-intento de conexión (Resiliencia de Infraestructura)
async function connectWithRetry(retries = 5, delay = 5000) {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log(
        "✅ Connection to Docker MySQL has been established successfully via Sequelize.",
      );
      return; // Conexión exitosa, salimos del ciclo
    } catch (error) {
      retries--;
      console.log(
        `⚠️ Database not ready yet. Retrying in ${delay / 1000}s... (${retries} retries left)`,
      );
      if (retries === 0) {
        console.error(
          "❌ Max connection retries reached. Unable to connect to the database:",
          error,
        );
        process.exit(1); // Cerramos si definitivamente no se pudo
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function startServer() {
  // Esperar a que la BD esté lista antes de levantar Express
  await connectWithRetry();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
