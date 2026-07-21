import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  LuCalendarCheck,
  LuClipboardCheck,
  LuClock,
  LuTriangleAlert,
} from "react-icons/lu";

const StatCard = ({ icon: Icon, label, value, color = "#197e88" }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs font-bold text-accent uppercase">{label}</p>
      <p className="text-2xl font-black text-primary">{value}</p>
    </div>
  </div>
);

const CollaboratorDashboard = ({ userName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [todayAppointments, setTodayAppointments] = useState([]);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [upcoming, setUpcoming] = useState([]);
  const [pendingAssessments, setPendingAssessments] = useState([]);

  const formatTime = (value) =>
    new Date(value).toLocaleString("es-MX", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [todayRes, countRes, upcomingRes, pendingRes] = await Promise.all([
        api.get("/dashboard/my-today-appointments"),
        api.get("/dashboard/my-monthly-count"),
        api.get("/dashboard/my-upcoming-appointments"),
        api.get("/dashboard/my-pending-assessments"),
      ]);

      setTodayAppointments(todayRes.data);
      setMonthlyCount(countRes.data.completedCount);
      setUpcoming(upcomingRes.data || []);
      setPendingAssessments(pendingRes.data);
      setError("");
    } catch (err) {
      setError("No se pudo cargar tu información del día.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) {
    return (
      <p className="text-secondary text-center font-medium p-8 text-sm">
        Cargando tu panel...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-600 text-center font-medium p-8 text-sm">
        {error}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-2 bg-blue-50 text-secondary border border-blue-100">
          Dashboard Colaborador
        </span>
        <p className="text-lg font-bold text-primary">
          Hola, {userName?.split(" ")[0] || "colaborador"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StatCard
          icon={LuCalendarCheck}
          label="Citas para hoy"
          value={todayAppointments.length}
          color="#197e88"
        />
        <StatCard
          icon={LuClipboardCheck}
          label="Servicios completados (mes)"
          value={monthlyCount}
          color="#16a34a"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2">
          <LuClock size={16} className="text-secondary" /> Tus Citas de Hoy
        </h3>
        {todayAppointments.length === 0 ? (
          <p className="text-xs text-accent text-center py-6">
            No tienes citas asignadas para el día de hoy.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-125">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-3 text-xs font-bold text-accent">Cliente</th>
                  <th className="p-3 text-xs font-bold text-accent">
                    Servicio
                  </th>
                  <th className="p-3 text-xs font-bold text-accent">Horario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {todayAppointments.map((appt) => (
                  <tr
                    key={appt.appointmentId}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-3 text-sm font-semibold text-primary">
                      {appt.customer?.name || "—"}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {appt.service?.name || "—"}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {formatTime(appt.startTime || appt.start_time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2">
          <LuClock size={16} className="text-secondary" /> Tus Próximas Citas
        </h3>
        {upcoming.length === 0 ? (
          <p className="text-xs text-accent text-center py-6">
            No tienes próximas citas pendientes.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-125">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-3 text-xs font-bold text-accent">Cliente</th>
                  <th className="p-3 text-xs font-bold text-accent">
                    Servicio
                  </th>
                  <th className="p-3 text-xs font-bold text-accent">Horario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcoming.map((appt) => (
                  <tr
                    key={appt.appointmentId}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-3 text-sm font-semibold text-primary">
                      {appt.customer?.name || "—"}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {appt.service?.name || "—"}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {formatTime(appt.startTime || appt.start_time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pendingAssessments.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-amber-800 uppercase mb-4 flex items-center gap-2">
            <LuTriangleAlert size={16} /> Expedientes Pendientes de Llenar
          </h3>
          <div className="flex flex-col gap-2">
            {pendingAssessments.map((appt) => (
              <div
                key={appt.appointmentId}
                className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-100"
              >
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {appt.customer?.name || "—"}
                  </p>
                  <p className="text-xs text-accent">
                    {appt.service?.name} · {appt.service?.brand}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                  Pendiente
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorDashboard;
