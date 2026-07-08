import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import sequelize from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import customerRoutes from "./src/routes/customerRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";

dotenv.config();

const app = express();

// Configuración de CORS para conectar con el Frontend de Vite
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Permite el intercambio de cookies HTTPOnly
  }),
);

app.use(express.json());
app.use(cookieParser());

// Endpoints del sistema
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);

const PORT = process.env.PORT || 5000;

// Bucle para esperar a que el contenedor de MySQL esté listo
async function connectWithRetry(retries = 10, delay = 5000) {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log("¡Conexión exitosa con el MySQL de Docker!");
      return;
    } catch (error) {
      retries--;
      console.log(
        `La base de datos aún no responde. Reintentando en ${delay / 1000}s... (Quedan ${retries} intentos)`,
      );
      if (retries === 0) {
        console.error(
          "Se agotaron los intentos de conexión. No se pudo conectar a la base de datos:",
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

  try {
    await sequelize.authenticate();
    console.log(
      "Conexión con MySQL verificada. El esquema se gestiona manualmente vía init.sql.",
    );
  } catch (error) {
    console.error(
      "Error al verificar la conexión con la base de datos:",
      error,
    );
  }

  app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en: http://localhost:${PORT}`);
  });
}

startServer();
