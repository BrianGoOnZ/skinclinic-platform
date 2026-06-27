import React, { useState } from "react";
import { LuX } from "react-icons/lu";

const NewEmployeeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    birth: "",
    gender: "M",
    address: "",
    job_position: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    medical_insurance_number: "",
    rol: "Colaborador",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Estructura en Tailwind lista para enviar:", formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-[650px] max-h-[90vh] rounded-2xl p-6 shadow-2xl overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold text-primary m-0">
            Registrar Nuevo Colaborador
          </h2>
          <button
            onClick={onClose}
            className="text-accent hover:text-secondary transition-colors cursor-pointer"
          >
            <LuX size={22} />
          </button>
        </div>

        <p className="text-xs text-accent text-left mb-4">
          Completa el expediente del colaborador. Se enviará un correo con su
          acceso temporal automáticamente.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <h3 className="text-sm font-semibold text-secondary border-b border-blue-100 pb-1 mt-1">
            Datos Personales
          </h3>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-primary">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Karelia Juárez"
              className="w-full p-2.5 rounded-lg border border-borderClinik focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-primary">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@depilclinik.com"
                className="w-full p-2.5 rounded-lg border border-borderClinik focus:outline-none focus:border-secondary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-primary">
                Teléfono *
              </label>
              <input
                type="tel"
                name="phone"
                required
                maxLength="10"
                value={formData.phone}
                onChange={handleChange}
                placeholder="6181234567"
                className="w-full p-2.5 rounded-lg border border-borderClinik focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-primary">Género *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-borderClinik bg-white focus:outline-none focus:border-secondary"
              >
                <option value="M">Mujer</option>
                <option value="H">Hombre</option>
                <option value="ND">No Definido</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-primary">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="birth"
                value={formData.birth}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-borderClinik focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-primary">
              Dirección Particular
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Calle, Número, Colonia..."
              rows="2"
              className="w-full p-2.5 rounded-lg border border-borderClinik resize-none focus:outline-none focus:border-secondary"
            />
          </div>

          {/* SECCIÓN 2: PUESTO Y SEGURO */}
          <h3 className="text-sm font-semibold text-secondary border-b border-blue-100 pb-1 mt-2">
            Información Laboral
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-primary">
                Puesto de Trabajo
              </label>
              <input
                type="text"
                name="job_position"
                value={formData.job_position}
                onChange={handleChange}
                placeholder="Ej. Especialista Láser"
                className="w-full p-2.5 rounded-lg border border-borderClinik focus:outline-none focus:border-secondary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-primary">
                Rol de Sistema *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-borderClinik bg-white focus:outline-none focus:border-secondary"
              >
                <option value="Colaborador">Colaborador</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-primary">
              Número de Seguro Médico (Único)
            </label>
            <input
              type="text"
              name="medical_insurance_number"
              value={formData.medical_insurance_number}
              onChange={handleChange}
              placeholder="NSS de 11 dígitos"
              className="w-full p-2.5 rounded-lg border border-borderClinik focus:outline-none focus:border-secondary"
            />
          </div>

          {/* SECCIÓN 3: CONTACTO DE EMERGENCIA */}
          <h3 className="text-sm font-semibold text-secondary border-b border-blue-100 pb-1 mt-2">
            Contacto de Emergencia
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-bold text-primary">
                Nombre del Contacto
              </label>
              <input
                type="text"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                placeholder="Ej. Mamá o Cónyuge"
                className="w-full p-2.5 rounded-lg border border-borderClinik focus:outline-none focus:border-secondary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-primary">
                Teléfono Contacto
              </label>
              <input
                type="tel"
                name="emergency_contact_phone"
                maxLength="10"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                placeholder="10 dígitos"
                className="w-full p-2.5 rounded-lg border border-borderClinik focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-borderClinik text-xs font-semibold text-primary hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-secondary text-xs font-semibold text-white hover:bg-[#14676f] transition-colors cursor-pointer shadow-sm"
            >
              Enviar Invitación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEmployeeModal;
