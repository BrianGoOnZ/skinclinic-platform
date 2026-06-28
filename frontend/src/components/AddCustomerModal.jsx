import React, { useState, useEffect } from "react";
import api from "../services/api";

const AddCustomerModal = ({ isOpen, onClose, onRefresh }) => {
  const initialFormState = {
    name: "",
    phone: "",
    email: "",
    birthdate: "",
    gender: "M",
    address: "",
    occupation: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalInsuranceNumber: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/customers/create", formData);
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar el cliente");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col text-left">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/70">
          <h2 className="text-lg font-bold text-primary">
            Registrar Nuevo Cliente
          </h2>
          <button
            onClick={onClose}
            className="text-accent hover:text-primary text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-4 flex-1"
        >
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 text-center">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-1">
                Teléfono *
              </label>
              <input
                type="text"
                name="phone"
                maxLength="10"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="birthdate"
                required
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-1">
                Género *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
              >
                <option value="M">Mujer</option>
                <option value="H">Hombre</option>
                <option value="ND">No Definido</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-1">
                Ocupación
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase mb-1">
              Dirección
            </label>
            <textarea
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white resize-none"
            ></textarea>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-sm font-bold text-secondary">
              Contacto de Emergencia
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="emergencyContactPhone"
                  maxLength="10"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-xs font-bold text-primary uppercase mb-1">
              Número de Seguro Médico / ID
            </label>
            <input
              type="text"
              name="medicalInsuranceNumber"
              value={formData.medicalInsuranceNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
            />
          </div>

          <div className="border-t border-gray-100 pt-4 flex justify-end gap-2 bg-gray-50/70 -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-borderClinik rounded-full text-xs font-semibold text-primary hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-secondary text-white font-bold text-xs hover:bg-[#14676f] transition-colors cursor-pointer shadow-md"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
