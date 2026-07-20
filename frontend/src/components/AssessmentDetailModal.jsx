import React from "react";
import { LuX } from "react-icons/lu";
import AssessmentSummaryView from "./clinicalRecord/AssessmentSummaryView";

const AssessmentDetailModal = ({ isOpen, assessment, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col text-left">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/70">
          <div>
            <h2 className="text-lg font-bold text-primary">
              Expediente Clínico
            </h2>
            <p className="text-xs text-accent">
              {assessment?.customer?.name || "Cliente"}
              {assessment?.createdAt &&
                ` · ${new Date(assessment.createdAt).toLocaleDateString(
                  "es-MX",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-accent hover:text-primary text-sm font-bold cursor-pointer"
          >
            <LuX size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {assessment ? (
            <AssessmentSummaryView assessment={assessment} />
          ) : (
            <p className="text-sm text-accent text-center py-8">Cargando...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetailModal;
