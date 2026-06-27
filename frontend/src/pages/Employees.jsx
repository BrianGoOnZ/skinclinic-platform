import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  LuSearch,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuRefreshCw,
} from "react-icons/lu";
import "../styles/Employees.css";
import NewEmployeeModal from "../components/NewEmployeeModal";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/usuarios");
      setEmployees(response.data);
      setError("");
    } catch (err) {
      setError("No se pudo conectar con el panel de colaboradores.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    return words
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "25px",
        width: "100%",
      }}
    >
      <div className="employees-header">
        <h1>Gestión de Colaboradores</h1>
        <button onClick={fetchEmployees} className="sync-btn">
          <LuRefreshCw size={16} /> Sincronizar Datos
        </button>
      </div>

      <div className="employees-toolbar">
        <div className="search-container">
          <LuSearch size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar Colaborador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          <LuPlus size={16} /> Nuevo Colaborador
        </button>
      </div>

      <div className="table-card">
        {loading ? (
          <p style={{ color: "#3a6366", textAlign: "center", padding: "20px" }}>
            Cargando colaboradores...
          </p>
        ) : error ? (
          <p style={{ color: "#e53935", textAlign: "center", padding: "20px" }}>
            {error}
          </p>
        ) : filteredEmployees.length === 0 ? (
          <p style={{ color: "#5b9fa6", textAlign: "center", padding: "20px" }}>
            No se encontraron colaboradores.
          </p>
        ) : (
          <table className="employees-table">
            <thead>
              <tr>
                <th style={{ width: "45%" }}>Colaborador</th>
                <th style={{ width: "35%" }}>Rol</th>
                <th style={{ width: "20%", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.user_id}
                  style={{ opacity: emp.is_active ? 1 : 0.5 }}
                >
                  <td>
                    <div className="colab-info">
                      <div className="colab-avatar">
                        {getInitials(emp.name)}
                      </div>
                      <div className="colab-meta">
                        <span className="colab-name">
                          {emp.name} {!emp.is_active && "(Inactivo)"}
                        </span>
                        <span className="colab-email">{emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`colab-role ${emp.rol === "Administrador" ? "admin" : "staff"}`}
                    >
                      {emp.rol}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="edit-btn">
                        <LuPencil size={18} />
                      </button>
                      <button className="delete-btn">
                        <LuTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Reemplaza el bloque anterior por esta línea limpia */}
      <NewEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Employees;
