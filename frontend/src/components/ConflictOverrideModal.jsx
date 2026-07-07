import React from "react";
import { LuTriangleAlert } from "react-icons/lu";

const ConflictOverrideModal = ({
  isOpen,
  conflict,
  onCancel,
  onForce,
  loading,
}) => {
  if (!isOpen) return null;

  const formatTime = (value) =>
    new Date(value).toLocaleString("es-MX", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <LuTriangleAlert size={22} />
          </div>
          <h2 className="text-lg font-bold text-primary">
            Conflicto de Horario
          </h2>
        </div>

        <p className="text-sm text-accent mb-3">
          Este colaborador ya tiene una cita asignada que se cruza con el
          horario seleccionado:
        </p>

        {conflict && (
          <div className="bg-gray-50 border border-borderClinik rounded-xl p-3 mb-4 text-sm">
            <p className="font-semibold text-primary">
              {conflict.customer?.name || "Cliente"} ·{" "}
              {conflict.service?.name || ""}
            </p>
            <p className="text-xs text-accent mt-1">
              {formatTime(conflict.startTime)} — {formatTime(conflict.endTime)}
            </p>
          </div>
        )}

        <p className="text-xs text-accent mb-6">
          Solo la Administradora puede forzar esta reserva a pesar del cruce de
          horarios.
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-borderClinik rounded-full text-xs font-semibold text-primary hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onForce}
            disabled={loading}
            className="px-5 py-2.5 rounded-full bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? "Forzando..." : "Forzar Reserva"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictOverrideModal;
