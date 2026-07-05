import Service from "../models/Service.js";

export const getAllServices = async (req, res) => {
  try {
    const { brand } = req.query;
    const where = { isActive: true };
    if (brand) where.brand = brand;

    const services = await Service.findAll({
      where,
      order: [["name", "ASC"]],
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching services",
      error: error.message,
    });
  }
};
