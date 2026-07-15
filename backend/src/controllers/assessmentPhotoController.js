import AssessmentPhoto from "../models/AssessmentPhoto.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const PHOTO_ANGLES = [
  "Frente",
  "Perfil Derecho",
  "Perfil Izquierdo",
  "45 Grados",
  "135 Grados",
];

// Crea las 5 filas placeholder (pendientes) para una sesión recién guardada.
// Se llama internamente justo después de crear un Medical_Assessment o
// Laser_Medical_Assessment, no se expone como ruta directa.
export const createPendingPhotosForAssessment = async (
  { assessmentId, laserAssessmentId },
  transaction,
) => {
  if (!assessmentId && !laserAssessmentId) {
    throw new Error(
      "Se requiere assessmentId o laserAssessmentId para crear las fotos",
    );
  }
  if (assessmentId && laserAssessmentId) {
    throw new Error(
      "Un registro de fotos no puede pertenecer a ambos expedientes a la vez",
    );
  }

  return AssessmentPhoto.bulkCreate(
    PHOTO_ANGLES.map((angle) => ({
      assessmentId: assessmentId || null,
      laserAssessmentId: laserAssessmentId || null,
      photoAngle: angle,
      isPending: true,
    })),
    { transaction },
  );
};

// Sube el archivo real a Cloudinary y actualiza la foto correspondiente
export const uploadAssessmentPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo" });
    }

    const photo = await AssessmentPhoto.findByPk(photoId);
    if (!photo) {
      return res.status(404).json({ message: "Foto no encontrada" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "skinclinic/assessment-photos" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    await photo.update({
      photoUrl: uploadResult.secure_url,
      isPending: false,
      uploadedByUserId: req.user.id,
    });

    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({
      message: "Server error while uploading photo",
      error: error.message,
    });
  }
};

// Lista las 5 fotos (subidas o pendientes) de un expediente específico
export const getPhotosByAssessment = async (req, res) => {
  try {
    const { assessmentId, laserAssessmentId } = req.query;

    if (!assessmentId && !laserAssessmentId) {
      return res.status(400).json({
        message: "Se requiere assessmentId o laserAssessmentId",
      });
    }

    const where = assessmentId ? { assessmentId } : { laserAssessmentId };

    const photos = await AssessmentPhoto.findAll({
      where,
      order: [["photo_id", "ASC"]],
    });

    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching photos",
      error: error.message,
    });
  }
};
