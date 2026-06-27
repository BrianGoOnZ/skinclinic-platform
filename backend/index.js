import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import sequelize from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import customerRoutes from "./src/routes/customerRoutes.js";

dotenv.config();

const app = express();

// Configuración de CORS con credenciales para tu React
app.use(
  cors({
    origin: "http://localhost:5173", // El puerto por defecto de Vite
    credentials: true, // Permite que las cookies HTTPOnly viajen entre puertos
  }),
);

app.use(express.json());
app.use(cookieParser());

// Vincula las rutas aquí abajo de los middlewares globales
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

const PORT = process.env.PORT || 5000;

// Estrategia de re-intento de conexión (Resiliencia de Infraestructura)
async function connectWithRetry(retries = 5, delay = 5000) {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log(
        "Connection to Docker MySQL has been established successfully via Sequelize.",
      );
      return;
    } catch (error) {
      retries--;
      console.log(
        `Database not ready yet. Retrying in ${delay / 1000}s... (${retries} retries left)`,
      );
      if (retries === 0) {
        console.error(
          "Max connection retries reached. Unable to connect to the database:",
          error,
        );
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function startServer() {
  await connectWithRetry();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
