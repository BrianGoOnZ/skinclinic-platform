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

// 3. Obtener un solo cliente por su ID (Reemplaza la que tienes por esta)
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    // Buscamos directamente por su Llave Primaria (ID) sin importar si está activo o no
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching customer",
      error: error.message,
    });
  }
};

// 4. Actualizar los datos de un cliente
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Actualizamos el registro con los datos que vengan en el body
    await customer.update(req.body);

    res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating customer",
      error: error.message,
    });
  }
};

// 5. Baja Lógica (Cambiar isActive a false)
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // En lugar de destroy(), apagamos el switch de isActive
    await customer.update({ isActive: false });

    res.status(200).json({
      message: "Customer deactivated successfully (Logical Deletion)",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deactivating customer",
      error: error.message,
    });
  }
};

// 6. Reactivar un cliente (Baja Lógica Inversa)
export const reactivateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.isActive) {
      return res.status(400).json({ message: "Customer is already active" });
    }

    // Volvemos a encender el switch
    await customer.update({ isActive: true });

    res.status(200).json({
      message: "Customer reactivated successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while reactivating customer",
      error: error.message,
    });
  }
};
