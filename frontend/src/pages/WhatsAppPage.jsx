import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { LuSearch, LuRefreshCw, LuMessageCircle } from "react-icons/lu";
import { WHATSAPP_STATUS_META } from "../constants/whatsappStatus";
import { showToast, showError } from "../utils/alerts";

const WhatsAppPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [resendingId, setResendingId] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/whatsapp", {
        params: {
          status: statusFilter || undefined,
          search: search || undefined,
        },
      });
      setNotifications(response.data);
      setError("");
    } catch (err) {
      setError("No se pudo cargar el registro de confirmaciones.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleResend = async (id) => {
    setResendingId(id);
    try {
      await api.post(`/whatsapp/${id}/resend`);
      showToast("success", "Mensaje reenviado");
      await fetchNotifications();
    } catch (err) {
      showError("Error", "No se pudo reenviar el mensaje");
    } finally {
      setResendingId(null);
    }
  };

  const formatDateTime = (value) =>
    value
      ? new Date(value).toLocaleString("es-MX", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

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
            placeholder="Buscar por cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-borderClinik text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white transition-shadow"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-borderClinik text-sm bg-white focus:outline-none focus:border-secondary"
        >
          <option value="">Todos los estados</option>
          {Object.entries(WHATSAPP_STATUS_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-secondary text-center font-medium p-8 text-sm">
            Cargando confirmaciones...
          </p>
        ) : error ? (
          <p className="text-red-600 text-center font-medium p-8 text-sm">
            {error}
          </p>
        ) : notifications.length === 0 ? (
          <p className="text-accent text-center font-medium p-8 text-sm">
            No hay recordatorios enviados todavía.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-175">
              <thead>
                <tr className="border-b border-gray-100 bg-linear-to-r from-secondary/5 to-depil/5">
                  <th className="p-4 text-xs font-bold text-primary">
                    Cliente
                  </th>
                  <th className="p-4 text-xs font-bold text-primary">Cita</th>
                  <th className="p-4 text-xs font-bold text-primary">
                    Enviado
                  </th>
                  <th className="p-4 text-xs font-bold text-primary">Estado</th>
                  <th className="p-4 text-xs font-bold text-primary text-right">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notifications.map((n) => {
                  const meta =
                    WHATSAPP_STATUS_META[n.status] ||
                    WHATSAPP_STATUS_META.Pendiente;
                  const canResend = [
                    "Fallido",
                    "Sin_Respuesta",
                    "Enviado",
                  ].includes(n.status);
                  return (
                    <tr key={n.notificationId} className="hover:bg-gray-50/50">
                      <td className="p-4">
                        <span className="text-sm font-semibold text-primary">
                          {n.appointment?.customer?.name || "—"}
                        </span>
                        <p className="text-xs text-accent">{n.customerPhone}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {n.appointment?.service?.name || "—"}
                        <p className="text-xs text-accent">
                          {formatDateTime(n.appointment?.startTime)}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {formatDateTime(n.sentAt)}
                      </td>
                      <td className="p-4">
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
                          style={{ backgroundColor: meta.color }}
                        >
                          {meta.label}
                        </span>
                        {n.retryCount > 0 && (
                          <span className="ml-1.5 text-[10px] text-accent">
                            (x{n.retryCount + 1})
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {canResend && (
                          <button
                            onClick={() => handleResend(n.notificationId)}
                            disabled={resendingId === n.notificationId}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-white text-xs font-bold hover:bg-[#14676f] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <LuRefreshCw
                              size={13}
                              className={
                                resendingId === n.notificationId
                                  ? "animate-spin"
                                  : ""
                              }
                            />
                            Reenviar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppPage;
