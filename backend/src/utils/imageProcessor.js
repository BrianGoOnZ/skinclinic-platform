import sharp from "sharp";

// Redimensiona y convierte a WebP antes de subir. 1600px de lado más largo
// es más que suficiente para zoom clínico; calidad 80 en WebP da un buen
// balance peso/calidad (reduce ~70-85% el tamaño típico de una foto de celular).
export const compressImage = async (buffer) => {
  return sharp(buffer)
    .rotate() // respeta la orientación EXIF de fotos tomadas con celular
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();
};
