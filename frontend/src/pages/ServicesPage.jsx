import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  LuPlus,
  LuPencil,
  LuCalendarClock,
  LuClipboardCheck,
  LuTag,
} from "react-icons/lu";
import ServiceModal from "../components/ServiceModal";
import { LuCheck } from "react-icons/lu";
import {
  showLoading,
  closeAlert,
  showSuccess,
  showError,
  showConfirm,
  showToast,
} from "../utils/alerts";

const BRAND_COLORS = {
  "Modelha DK": "#197e88",
  Depilclinik: "#c026d3",
};

const FILTER_COLORS = {
  Todos: "#012438",
  ...BRAND_COLORS,
};

const ServicesPage = ({ currentUserRole }) => {
  const isAdmin = currentUserRole === "Administrador";
  const [services, setServices] = useState([]);
  const [brandFilter, setBrandFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/services");
      setServices(response.data);
      setError("");
    } catch (err) {
      setError("No se pudo conectar con el catálogo de servicios.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (service) => {
    const willDeactivate = service.isActive;
    const confirmed = await showConfirm({
      title: willDeactivate ? "¿Desactivar servicio?" : "¿Reactivar servicio?",
      text: service.name,
    });
    if (!confirmed) return;

    setTogglingId(service.serviceId);
    showLoading("Actualizando estado...");
    try {
      if (willDeactivate) {
        await api.patch(`/services/${service.serviceId}/delete`);
      } else {
        await api.patch(`/services/${service.serviceId}/reactivate`);
      }
      await fetchServices();
      closeAlert();
      showToast(
        "success",
        willDeactivate ? "Servicio desactivado" : "Servicio reactivado",
      );
    } catch (err) {
      closeAlert();
      showError("Error", "No se pudo actualizar el estado del servicio");
    } finally {
      setTogglingId(null);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  const filteredServices = services.filter(
    (s) => brandFilter === "Todos" || s.brand === brandFilter,
  );

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["Todos", "Modelha DK", "Depilclinik"].map((brand) => {
            const isActive = brandFilter === brand;
            const color = FILTER_COLORS[brand];
            return (
              <button
                key={brand}
                onClick={() => setBrandFilter(brand)}
                className="px-4 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer"
                style={
                  isActive
                    ? {
                        backgroundColor: color,
                        borderColor: color,
                        color: "#fff",
                      }
                    : { borderColor: color, color }
                }
              >
                {brand}
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
            style={{ backgroundColor: FILTER_COLORS[brandFilter] }}
          >
            <LuPlus size={14} /> Nuevo Servicio
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-secondary text-center font-medium p-8 text-sm">
          Cargando catálogo...
        </p>
      ) : error ? (
        <p className="text-red-600 text-center font-medium p-8 text-sm">
          {error}
        </p>
      ) : filteredServices.length === 0 ? (
        <p className="text-accent text-center font-medium p-8 text-sm">
          No se encontraron servicios registrados.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => (
            <div
              key={service.serviceId}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative transition-opacity"
              style={{ opacity: service.isActive ? 1 : 0.55 }}
            >
              <div
                className="px-5 py-3.5 flex items-center justify-between"
                style={{ backgroundColor: BRAND_COLORS[service.brand] }}
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  {service.brand}
                </span>

                {isAdmin && (
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <LuPencil size={17} />
                  </button>
                )}
              </div>

              <div className="p-5 flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="text-base font-bold text-primary leading-snug">
                    {service.name}
                    {!service.isActive && (
                      <span className="text-xs font-semibold text-red-500 ml-2">
                        (Inactivo)
                      </span>
                    )}
                  </h3>
                  {service.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>

                <div className="flex items-end gap-2 mt-auto">
                  {service.promoPrice ? (
                    <>
                      <span className="text-lg font-black text-secondary">
                        {formatPrice(service.promoPrice)}
                      </span>
                      <span className="text-xs text-gray-400 line-through mb-0.5">
                        {formatPrice(service.regularPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-black text-primary">
                      {formatPrice(service.regularPrice)}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                  {service.suggestedFrequency && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent bg-gray-50 border border-borderClinik/40 px-2.5 py-1 rounded-full">
                      <LuCalendarClock size={12} />
                      {service.suggestedFrequency}
                    </span>
                  )}

                  {service.inclusions?.length > 0 && (
                    <ul className="flex flex-col gap-1.5">
                      {service.inclusions.map((inc) => (
                        <li
                          key={inc.inclusionId}
                          className="flex items-start gap-2 text-xs text-primary"
                        >
                          <LuCheck
                            size={14}
                            className="text-secondary shrink-0 mt-0.5"
                          />
                          <span>{inc.itemName}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {service.requiresAssessment && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                      <LuClipboardCheck size={12} />
                      Requiere Valoración
                    </span>
                  )}
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleToggleActive(service)}
                    disabled={togglingId === service.serviceId}
                    className={`mt-1 w-full text-center py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${
                      service.isActive
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                  >
                    {togglingId === service.serviceId
                      ? "Actualizando..."
                      : service.isActive
                        ? "Desactivar Servicio"
                        : "Reactivar Servicio"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchServices}
        service={editingService}
      />
    </div>
  );
};

export default ServicesPage;
