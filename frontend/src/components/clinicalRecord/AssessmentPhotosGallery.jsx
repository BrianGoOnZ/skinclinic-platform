import React, { useState, useEffect } from "react";
import { LuX, LuCamera } from "react-icons/lu";
import api from "../../services/api";

const AssessmentPhotosGallery = ({ assessmentId, laserAssessmentId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!assessmentId && !laserAssessmentId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const query = assessmentId
          ? `assessmentId=${assessmentId}`
          : `laserAssessmentId=${laserAssessmentId}`;
        const response = await api.get(`/assessment-photos?${query}`);
        setPhotos((response.data || []).filter((p) => p.photoUrl));
      } catch (err) {
        console.error("Error al cargar fotografías del expediente:", err);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [assessmentId, laserAssessmentId]);

  if (loading) {
    return (
      <p className="text-xs text-gray-400 text-center py-6">
        Cargando fotografías...
      </p>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 text-gray-300 py-6">
        <LuCamera size={28} />
        <p className="text-xs text-gray-400 text-center">
          Este expediente no tiene fotografías subidas.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {photos.map((photo) => (
          <button
            key={photo.photoId}
            type="button"
            onClick={() => setSelectedPhoto(photo)}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <img
              src={photo.photoUrl}
              alt={photo.photoAngle}
              loading="lazy"
              className="w-full h-24 object-cover rounded-lg border border-gray-100 group-hover:opacity-80 transition-opacity"
            />
            <span className="text-[11px] font-semibold text-primary text-center">
              {photo.photoAngle}
            </span>
          </button>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-100 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-5 right-5 text-white hover:text-gray-300 cursor-pointer"
          >
            <LuX size={28} />
          </button>
          <img
            src={selectedPhoto.photoUrl}
            alt={selectedPhoto.photoAngle}
            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-bold bg-black/50 px-4 py-1.5 rounded-full">
            {selectedPhoto.photoAngle}
          </span>
        </div>
      )}
    </>
  );
};

export default AssessmentPhotosGallery;
