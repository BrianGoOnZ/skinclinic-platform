import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  reactivateCustomer,
  searchCustomers,
} from "../controllers/customerController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Todas las rutas del directorio clínico de clientes quedan protegidas
router.post("/create", protect, createCustomer);
router.get("/", protect, getAllCustomers);
router.get("/search", protect, searchCustomers);
router.get("/:id", protect, getCustomerById);
router.put("/:id", protect, updateCustomer);
router.patch("/:id/delete", protect, deleteCustomer);
router.patch("/:id/reactivate", protect, reactivateCustomer);

export default router;
