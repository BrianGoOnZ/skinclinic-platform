import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Protegemos todas las rutas de este archivo.
// Quien no tenga un token válido, será rebotado de inmediato.
router.use(protect);

// Rutas para Clientes
router.post("/create", createCustomer); // POST http://localhost:5000/api/customers/create
router.get("/all", getAllCustomers); // GET http://localhost:5000/api/customers/all
router.get("/:id", getCustomerById); // GET http://localhost:5000/api/customers/1
router.put("/:id", updateCustomer); // PUT http://localhost:5000/api/customers/1
router.patch("/:id/status", deleteCustomer); // PATCH http://localhost:5000/api/customers/1/status

export default router;
