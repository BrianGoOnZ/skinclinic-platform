import express from "express";
import {
  createCustomer,
  getAllCustomers,
} from "../controllers/customerController.js";
import { protect } from "../middlewares/auth.js"; // <-- Importamos al policía de ayer

const router = express.Router();

// Protegemos todas las rutas de este archivo.
// Quien no tenga un token válido, será rebotado de inmediato.
router.use(protect);

// Rutas para Clientes
router.post("/create", createCustomer); // POST http://localhost:5000/api/customers/create
router.get("/all", getAllCustomers); // GET http://localhost:5000/api/customers/all

export default router;
