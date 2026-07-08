import React, { useState, useEffect } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import api from "../services/api";
import ConflictOverrideModal from "./ConflictOverrideModal";
import {
  APPOINTMENT_STATUSES,
  STATUS_META,
} from "../constants/appointmentStatus";

const initialFormState = {
  marca: "Modelha DK",
  customerId: "",
  serviceId: "",
  userId: "",
  startTime: "",
  endTime: "",
  status: "Programada",
};

const toDatetimeLocalValue = (isoString) => {
  const date = new Date(isoString);
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const AppointmentModal = ({ isOpen, onClose, onRefresh, appointment }) => {
  const isEditMode = Boolean(appointment);

  const [formData, setFormData] = useState(initialFormState);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [liveConflict, setLiveConflict] = useState(null);
  const [conflictToConfirm, setConflictToConfirm] = useState(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setLiveConflict(null);
      setShowOverrideModal(false);

      if (isEditMode) {
        setFormData({
          marca: appointment.marca,
          customerId: String(
            appointment.customer?.customerId || appointment.customerId || "",
          ),
          serviceId: String(
            appointment.service?.serviceId || appointment.serviceId || "",
          ),
          userId: appointment.collaborator?.id
            ? String(appointment.collaborator.id)
            : appointment.userId
              ? String(appointment.userId)
              : "",
          startTime: toDatetimeLocalValue(appointment.startTime),
          endTime: toDatetimeLocalValue(appointment.endTime),
          status: appointment.status,
        });
      } else {
        setFormData(initialFormState);
      }

      fetchOptions();
    }
  }, [isOpen, appointment]);

  useEffect(() => {
    if (isOpen) {
      fetchServicesByBrand(formData.marca);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.marca, isOpen]);

  useEffect(() => {
    if (!formData.userId || !formData.startTime || !formData.endTime) {
      setLiveConflict(null);
      return;
    }
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setLiveConflict(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.get("/appointments/check-conflict", {
          params: {
            userId: formData.userId,
            startTime: formData.startTime,
            endTime: formData.endTime,
            excludeId: isEditMode ? appointment.appointmentId : undefined,
          },
        });
        setLiveConflict(
          response.data.hasConflict ? response.data.conflict : null,
        );
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    formData.userId,
    formData.startTime,
    formData.endTime,
    isEditMode,
    appointment,
  ]);

  const fetchOptions = async () => {
    try {
      const [customersRes, usersRes] = await Promise.all([
        api.get("/customers"),
        api.get("/auth/usuarios"),
      ]);
      setCustomers(customersRes.data);
      setCollaborators(usersRes.data.filter((u) => u.is_active));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServicesByBrand = async (brand) => {
    try {
      const response = await api.get(
        `/services?brand=${encodeURIComponent(brand)}`,
      );
      setServices(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const buildPayload = (force) => ({
    customerId: Number(formData.customerId),
    serviceId: Number(formData.serviceId),
    userId: formData.userId ? Number(formData.userId) : null,
    marca: formData.marca,
    startTime: formData.startTime,
    endTime: formData.endTime,
    force,
  });

  const submitAppointment = async (force = false) => {
    setLoading(true);
    setError("");

    try {
      if (isEditMode) {
        await api.put(
          `/appointments/${appointment.appointmentId}`,
          buildPayload(force),
        );
        if (formData.status !== appointment.status) {
          await api.patch(`/appointments/${appointment.appointmentId}/status`, {
            status: formData.status,
          });
        }
      } else {
        await api.post("/appointments", buildPayload(force));
      }
      onRefresh();
      onClose();
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictToConfirm(err.response.data.conflict);
        setShowOverrideModal(true);
      } else {
        setError(
          err.response?.data?.message ||
            `Error al ${isEditMode ? "actualizar" : "agendar"} la cita`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitAppointment(false);
  };

  const handleForceOverride = async () => {
    await submitAppointment(true);
    setShowOverrideModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col text-left">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/70">
          <h2 className="text-lg font-bold text-primary">
            {isEditMode ? "Editar Cita" : "Nueva Cita"}
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

          {isEditMode && (
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-1">
                Estado
              </label>
              <div className="flex flex-wrap gap-2">
                {APPOINTMENT_STATUSES.map((status) => {
                  const meta = STATUS_META[status];
                  const isSelected = formData.status === status;
                  return (
                    <button
                      type="button"
                      key={status}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status }))
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? "text-white border-transparent"
                          : "border-borderClinik text-primary hover:bg-gray-50"
                      }`}
                      style={isSelected ? { backgroundColor: meta.color } : {}}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: isSelected ? "#fff" : meta.color,
                        }}
                      />
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-primary uppercase mb-1">
              Marca *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Modelha DK", "Depilclinik"].map((brand) => (
                <button
                  type="button"
                  key={brand}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      marca: brand,
                      serviceId: "",
                    }))
                  }
                  className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                    formData.marca === brand
                      ? "bg-secondary text-white border-secondary"
                      : "border-borderClinik text-primary hover:bg-gray-50"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase mb-1">
              Cliente *
            </label>
            <select
              name="customerId"
              required
              value={formData.customerId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
            >
              <option value="">Selecciona un cliente</option>
              {customers.map((c) => (
                <option key={c.customerId} value={c.customerId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase mb-1">
              Servicio *
            </label>
            <select
              name="serviceId"
              required
              value={formData.serviceId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
            >
              <option value="">
                Selecciona un servicio de {formData.marca}
              </option>
              {services.map((s) => (
                <option key={s.serviceId} value={s.serviceId}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase mb-1">
              Colaborador
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
            >
              <option value="">Sin asignar</option>
              {collaborators.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-1">
                Inicio *
              </label>
              <input
                type="datetime-local"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-1">
                Fin *
              </label>
              <input
                type="datetime-local"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
              />
            </div>
          </div>

          {liveConflict && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              <LuTriangleAlert size={16} className="shrink-0 mt-0.5" />
              <span>
                Este colaborador ya tiene la cita de{" "}
                <strong>{liveConflict.customer?.name || "otro cliente"}</strong>{" "}
                en un horario que se cruza. Podrás forzar la reserva al guardar.
              </span>
            </div>
          )}

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
              disabled={loading}
              className="px-5 py-2.5 rounded-full bg-secondary text-white font-bold text-xs hover:bg-[#14676f] transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading
                ? "Guardando..."
                : isEditMode
                  ? "Guardar Cambios"
                  : "Agendar Cita"}
            </button>
          </div>
        </form>
      </div>

      <ConflictOverrideModal
        isOpen={showOverrideModal}
        conflict={conflictToConfirm}
        onCancel={() => setShowOverrideModal(false)}
        onForce={handleForceOverride}
        loading={loading}
      />
    </div>
  );
};

export default AppointmentModal;
