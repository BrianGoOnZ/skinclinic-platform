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
    console.log("Estructura lista para enviar:", formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container scrollable-modal">
        {/* Modal Title Block */}
        <div className="modal-header">
          <h2>Registrar Nuevo Colaborador</h2>
          <button onClick={onClose} className="modal-close-btn">
            <LuX size={22} />
          </button>
        </div>

        <p className="modal-description">
          Completa el expediente del colaborador. Se enviará un correo con su
          acceso temporal automáticamente.
        </p>

        {/* Structural Form Fields */}
        <form onSubmit={handleSubmit} className="modal-form-structure">
          {/* Section 1: Personal Profile Data */}
          <h3 className="form-section-title">Datos Personales</h3>

          <div className="form-field-group">
            <label>Nombre Completo *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Karelia Juárez"
            />
          </div>

          <div className="form-field-row">
            <div className="form-field-group">
              <label>Correo Electrónico *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@depilclinik.com"
              />
            </div>
            <div className="form-field-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                name="phone"
                required
                maxLength="10"
                value={formData.phone}
                onChange={handleChange}
                placeholder="6181234567"
              />
            </div>
          </div>

          <div className="form-field-row">
            <div className="form-field-group">
              <label>Género *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="M">Mujer</option>
                <option value="H">Hombre</option>
                <option value="ND">No Definido</option>
              </select>
            </div>
            <div className="form-field-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="birth"
                value={formData.birth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field-group">
            <label>Dirección Particular</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Calle, Número, Colonia..."
              rows="2"
            />
          </div>

          {/* Section 2: Operational / Job Data */}
          <h3 className="form-section-title">Información Laboral</h3>

          <div className="form-field-row">
            <div className="form-field-group">
              <label>Puesto de Trabajo</label>
              <input
                type="text"
                name="job_position"
                value={formData.job_position}
                onChange={handleChange}
                placeholder="Ej. Especialista Láser"
              />
            </div>
            <div className="form-field-group">
              <label>Rol de Sistema *</label>
              <select name="rol" value={formData.rol} onChange={handleChange}>
                <option value="Colaborador">Colaborador</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
          </div>

          <div className="form-field-group">
            <label>Número de Seguro Médico (Único)</label>
            <input
              type="text"
              name="medical_insurance_number"
              value={formData.medical_insurance_number}
              onChange={handleChange}
              placeholder="NSS de 11 dígitos"
            />
          </div>

          {/* Section 3: Emergency Contingency Contact */}
          <h3 className="form-section-title">Contacto de Emergencia</h3>

          <div className="form-field-row">
            <div className="form-field-group flex-double">
              <label>Nombre del Contacto</label>
              <input
                type="text"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                placeholder="Ej. Mamá o Cónyuge"
              />
            </div>
            <div className="form-field-group">
              <label>Teléfono Contacto</label>
              <input
                type="tel"
                name="emergency_contact_phone"
                maxLength="10"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                placeholder="10 dígitos"
              />
            </div>
          </div>

          {/* Modal Interactive Actions */}
          <div className="modal-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-cancel-btn"
            >
              Cancelar
            </button>
            <button type="submit" className="modal-submit-btn">
              Enviar Invitación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEmployeeModal;
