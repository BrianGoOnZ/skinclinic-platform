import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  showConfirm,
  showLoading,
  closeAlert,
  showError,
} from "../utils/alerts";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    const confirmed = await showConfirm({
      title: "¿Cerrar sesión?",
      text: "Tendrás que iniciar sesión nuevamente para continuar.",
      icon: "question",
      confirmButtonText: "Sí, cerrar sesión",
    });

    if (!confirmed) return;

    showLoading("Cerrando sesión...");
    try {
      await api.post("/auth/logout");
      closeAlert();
    } catch (err) {
      closeAlert();
      showError("Error", "No se pudo cerrar la sesión correctamente");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
