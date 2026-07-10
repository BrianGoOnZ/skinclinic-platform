import Swal from "sweetalert2";

const baseConfig = {
  confirmButtonColor: "#197e88", // secondary
  cancelButtonColor: "#94a3b8",
  buttonsStyling: true,
};

export const showSuccess = (title, text = "") =>
  Swal.fire({
    icon: "success",
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    ...baseConfig,
  });

export const showError = (title, text = "") =>
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Entendido",
    ...baseConfig,
  });

export const showConfirm = async ({
  title,
  text = "",
  icon = "warning",
  confirmButtonText = "Sí, continuar",
  cancelButtonText = "Cancelar",
  confirmButtonColor = "#197e88",
}) => {
  const result = await Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor: "#94a3b8",
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export const showLoading = (title = "Procesando...") => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });
};

export const closeAlert = () => Swal.close();

export const showToast = (icon, title) =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
