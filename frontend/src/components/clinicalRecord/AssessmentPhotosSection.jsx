import React, { useState } from "react";
import { LuCamera, LuCheck, LuClock } from "react-icons/lu";

const ANGLES = [
  "Frente",
  "Perfil Derecho",
  "Perfil Izquierdo",
  "45 Grados",
  "135 Grados",
];

const AssessmentPhotosSection = ({ pendingUploads, onFileSelect }) => {
  const [previews, setPreviews] = useState({});

  const handleChange = (angle, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviews((prev) => ({ ...prev, [angle]: URL.createObjectURL(file) }));
    onFileSelect(angle, file);
  };

  return (
    <div className="border-t border-gray-100 pt-6">
      <p className="text-xs font-bold text-primary uppercase mb-1">
        Fotografías de la sesión
      </p>
      <p className="text-xs text-accent mb-4">
        Puedes subirlas ahora o dejarlas pendientes y completarlas después desde
        el expediente.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ANGLES.map((angle) => {
          const hasFile = Boolean(previews[angle] || pendingUploads[angle]);
          return (
            <label
              key={angle}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-dashed border-borderClinik hover:border-secondary transition-colors cursor-pointer bg-gray-50/50"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleChange(angle, e)}
              />
              {previews[angle] ? (
                <img
                  src={previews[angle]}
                  alt={angle}
                  className="w-full h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-20 flex items-center justify-center text-gray-300">
                  <LuCamera size={28} />
                </div>
              )}
              <span className="text-[11px] font-semibold text-primary text-center">
                {angle}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                  hasFile ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {hasFile ? (
                  <>
                    <LuCheck size={12} /> Lista
                  </>
                ) : (
                  <>
                    <LuClock size={12} /> Pendiente
                  </>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentPhotosSection;
