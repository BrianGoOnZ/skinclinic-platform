import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para entender formato JSON
app.use(express.json());

// Ruta de prueba (Endpoint de salud de la API)
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    message:
      "¡Servidor backend funcionando correctamente! Endpoint de salud de la API. Prueba exitosa.",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
