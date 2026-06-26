import Customer from "../models/Customer.js";

// 1. Registrar un cliente nuevo (Sincronizado con tus columnas)
export const createCustomer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      birthdate,
      gender,
      address,
      occupation,
      emergencyContactName,
      emergencyContactPhone,
      medicalInsuranceNumber,
    } = req.body;

    // Verificar si el teléfono ya existe (Es UNIQUE en tu SQL)
    const phoneExists = await Customer.findOne({ where: { phone } });
    if (phoneExists) {
      return res
        .status(400)
        .json({ message: "A customer with this phone number already exists" });
    }

    // Verificar el correo si lo proporcionaron (Es UNIQUE NULL en tu SQL)
    if (email) {
      const emailExists = await Customer.findOne({ where: { email } });
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "A customer with this email already exists" });
      }
    }

    // Crear el registro con todos los datos mapeados
    const newCustomer = await Customer.create({
      name,
      phone,
      email,
      birthdate, // Se guardará en la columna 'birth'
      gender,
      address,
      occupation,
      emergencyContactName,
      emergencyContactPhone,
      medicalInsuranceNumber,
    });

    res.status(201).json({
      message: "Customer registered successfully",
      customer: newCustomer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating customer",
      error: error.message,
    });
  }
};

// 2. Obtener todos los clientes activos
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({ where: { isActive: true } });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching customers",
      error: error.message,
    });
  }
};
