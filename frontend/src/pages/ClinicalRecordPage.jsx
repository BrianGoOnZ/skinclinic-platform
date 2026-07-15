import { useEffect, useState } from "react";
import api from "../services/api";
import { LuArrowLeft } from "react-icons/lu";
import {
  showConfirm,
  showError,
  showLoading,
  closeAlert,
} from "../utils/alerts";
import ModelhaAssessmentForm from "../components/clinicalRecord/ModelhaAssessmentForm";
import LaserAssessmentForm from "../components/clinicalRecord/LaserAssessmentForm";
import AssessmentPhotosSection from "../components/clinicalRecord/AssessmentPhotosSection";

const ClinicalRecordPage = ({ appointmentId, currentUser, onExit }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointmentData, setAppointmentData] = useState(null);
  const [brand, setBrand] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState({});

  const handlePhotoSelect = (angle, file) => {
    setPendingPhotos((prev) => ({ ...prev, [angle]: file }));
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/appointments`);
        const found = response.data.find(
          (a) => a.appointmentId === appointmentId,
        );

        if (!found) {
          setError("No se encontró la cita solicitada.");
          return;
        }

        setBrand(found.marca);

        const endpoint =
          found.marca === "Modelha DK"
            ? `/assessments/appointment/${appointmentId}`
            : `/laser-assessments/appointment/${appointmentId}`;

        const assessmentResponse = await api.get(endpoint);
        setAppointmentData(assessmentResponse.data);
        setError("");
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "No se pudo cargar el expediente de esta cita.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleExitClick = async () => {
    const confirmed = await showConfirm({
      title: "¿Salir sin guardar?",
      text: "Los datos que hayas capturado en esta sesión no se guardarán.",
      icon: "warning",
      confirmButtonText: "Sí, salir",
    });
    if (confirmed) onExit();
  };

  const handleSave = async (payload) => {
    const confirmed = await showConfirm({
      title: "¿Guardar expediente?",
      text: "Una vez guardado, no podrás volver a editarlo ni consultarlo desde tu usuario.",
      icon: "question",
      confirmButtonText: "Sí, guardar",
    });
    if (!confirmed) return;

    setSaving(true);
    showLoading("Guardando expediente...");
    try {
      const endpoint =
        brand === "Modelha DK"
          ? `/assessments/appointment/${appointmentId}`
          : `/laser-assessments/appointment/${appointmentId}`;

      const response = await api.post(endpoint, payload);
      const createdAssessment = response.data;

      const photoQuery =
        brand === "Modelha DK"
          ? `assessmentId=${createdAssessment.assessmentId}`
          : `laserAssessmentId=${createdAssessment.laserAssessmentId}`;

      const photosResponse = await api.get(`/assessment-photos?${photoQuery}`);
      const photoRecords = photosResponse.data;

      for (const [angle, file] of Object.entries(pendingPhotos)) {
        const matchingPhoto = photoRecords.find((p) => p.photoAngle === angle);
        if (matchingPhoto) {
          const formData = new FormData();
          formData.append("photo", file);
          await api.patch(
            `/assessment-photos/${matchingPhoto.photoId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
        }
      }

      closeAlert();
      onExit();
    } catch (err) {
      closeAlert();
      const msg =
        err.response?.data?.message || "No se pudo guardar el expediente.";
      showError("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eef2f5] flex flex-col">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={handleExitClick}
          className="flex items-center gap-2 text-sm font-bold text-accent hover:text-primary transition-colors cursor-pointer"
        >
          <LuArrowLeft size={18} />
          Regresar
        </button>
        <div className="w-px h-6 bg-gray-200" />
        <span className="text-lg font-black tracking-wide text-primary">
          Expediente Clínico
          {brand && (
            <span className="ml-2 text-sm font-semibold text-accent">
              · {brand}
            </span>
          )}
        </span>
      </header>

      <main className="flex-1 p-6 max-w-5xl w-full mx-auto">
        {loading ? (
          <p className="text-secondary text-center font-medium p-8 text-sm">
            Cargando expediente...
          </p>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-red-600 font-medium text-sm mb-4">{error}</p>
            <button
              onClick={onExit}
              className="px-5 py-2.5 rounded-full bg-secondary text-white font-bold text-xs cursor-pointer"
            >
              Volver a la Agenda
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <p className="text-sm text-accent mb-6">
              Cliente:{" "}
              <strong className="text-primary">
                {appointmentData?.customer?.name}
              </strong>
            </p>

            {brand === "Modelha DK" && (
              <>
                <ModelhaAssessmentForm onSubmit={handleSave} saving={saving} />
                <AssessmentPhotosSection
                  pendingUploads={pendingPhotos}
                  onFileSelect={handlePhotoSelect}
                />
              </>
            )}

            {brand === "Depilclinik" && (
              <>
                <LaserAssessmentForm onSubmit={handleSave} saving={saving} />{" "}
                <AssessmentPhotosSection
                  pendingUploads={pendingPhotos}
                  onFileSelect={handlePhotoSelect}
                />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClinicalRecordPage;
