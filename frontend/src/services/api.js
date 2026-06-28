import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, //Permite que el navegador guarde y envíe la cookie HTTPOnly automáticamente
});

export default api;
