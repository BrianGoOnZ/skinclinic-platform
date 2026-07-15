import React, { useEffect, useState } from "react";
import api from "../services/api";
import { LuSearch, LuPlus, LuPencil } from "react-icons/lu";
import NewEmployeeModal from "../components/NewEmployeeModal";
import {
  showConfirm,
  showLoading,
  closeAlert,
  showToast,
  showError,
} from "../utils/alerts";

const Employees = ({ currentUserRole }) => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const isAdmin = currentUserRole === "Administrador";

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

  const handleOpenEdit = async (userId) => {
    try {
      const response = await api.get(`/auth/usuarios/${userId}`);
      setEditingEmployee(response.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (emp) => {
    const willDeactivate = emp.is_active;
    const confirmed = await showConfirm({
      title: willDeactivate
        ? "¿Desactivar colaborador?"
        : "¿Reactivar colaborador?",
      text: `${emp.name} ${willDeactivate ? "no podrá acceder al sistema" : "recuperará su acceso"}.`,
      icon: "warning",
      confirmButtonText: willDeactivate ? "Sí, desactivar" : "Sí, reactivar",
    });
    if (!confirmed) return;

    setTogglingId(emp.user_id);
    showLoading("Actualizando estado...");
    try {
      if (willDeactivate) {
        await api.patch(`/auth/usuarios/${emp.user_id}/delete`);
      } else {
        await api.patch(`/auth/usuarios/${emp.user_id}/reactivate`);
      }
      await fetchEmployees();
      closeAlert();
      showToast(
        "success",
        willDeactivate ? "Colaborador desactivado" : "Colaborador reactivado",
      );
    } catch (err) {
      closeAlert();
      showError("Error", "No se pudo actualizar el estado del colaborador");
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <LuSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
          />
          <input
            type="text"
            placeholder="Buscar Colaborador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-borderClinik text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white transition-shadow"
          />
        </div>

        {isAdmin && (
          <button
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-secondary to-depil text-white font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-md self-start sm:self-center"
            onClick={handleOpenCreate}
          >
            <LuPlus size={14} /> Nuevo Colaborador
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-secondary text-center font-medium p-8 text-sm">
            Cargando colaboradores...
          </p>
        ) : error ? (
          <p className="text-red-600 text-center font-medium p-8 text-sm">
            {error}
          </p>
        ) : filteredEmployees.length === 0 ? (
          <p className="text-accent text-center font-medium p-8 text-sm">
            No se encontraron colaboradores.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gradient-to-r from-secondary/5 to-depil/5">
                  <th className="p-4 text-xs font-bold text-primary w-[45%]">
                    Colaborador
                  </th>
                  <th className="p-4 text-xs font-bold text-primary w-[35%]">
                    Rol
                  </th>
                  {isAdmin && (
                    <th className="p-4 text-xs font-bold text-primary w-[20%] text-right">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.user_id}
                    className="hover:bg-gray-50/50 transition-colors"
                    style={{ opacity: emp.is_active ? 1 : 0.5 }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-depil flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {getInitials(emp.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-primary truncate">
                            {emp.name} {!emp.is_active && "(Inactivo)"}
                          </span>
                          <span className="text-xs text-accent truncate">
                            {emp.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 vertical-middle">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                          emp.rol === "Administrador"
                            ? "bg-depil-soft text-depil"
                            : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {emp.rol}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="p-4 text-right vertical-middle">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleOpenEdit(emp.user_id)}
                            className="p-1.5 text-accent hover:text-secondary transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <LuPencil size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleActive(emp)}
                            disabled={togglingId === emp.user_id}
                            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                              emp.is_active ? "bg-secondary" : "bg-gray-300"
                            }`}
                            title={emp.is_active ? "Desactivar" : "Activar"}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                emp.is_active
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchEmployees}
        employee={editingEmployee}
      />
    </div>
  );
};

export default Employees;
