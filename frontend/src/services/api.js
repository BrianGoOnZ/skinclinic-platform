import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // La URL de tu backend en Docker
  withCredentials: true, //Permite que el navegador guarde y envíe la cookie HTTPOnly automáticamente
});

export default api;
