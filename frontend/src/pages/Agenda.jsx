import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { LuPlus } from "react-icons/lu";
import api from "../services/api";
import AppointmentModal from "../components/AppointmentModal";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales: { es },
});

const BRAND_COLORS = {
  "Modelha DK": "#197e88",
  Depilclinik: "#c026d3",
};

const Agenda = ({ currentUserRole }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  const isAdmin = currentUserRole === "Administrador";

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/appointments");
      setAppointments(response.data);
      setError("");
    } catch (err) {
      setError("No se pudo conectar con la agenda.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const events = appointments
    .filter((appt) => appt.startTime && appt.endTime)
    .map((appt) => ({
      id: appt.appointmentId,
      title: `${appt.customer?.name || "Cliente"} · ${appt.service?.name || ""}`,
      start: new Date(appt.startTime),
      end: new Date(appt.endTime),
      marca: appt.marca,
      status: appt.status,
    }));

  const eventPropGetter = (event) => {
    const color = BRAND_COLORS[event.marca] || "#5b9fa6";
    return {
      style: {
        backgroundColor: color,
        borderColor: color,
        opacity: event.status === "Cancelada" ? 0.4 : 1,
        textDecoration: event.status === "Cancelada" ? "line-through" : "none",
      },
    };
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-primary">Agenda</h1>
          <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-accent">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: BRAND_COLORS["Modelha DK"] }}
              />
              Modelha DK
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: BRAND_COLORS["Depilclinik"] }}
              />
              Depilclinik
            </span>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-bold text-xs hover:bg-[#14676f] transition-colors cursor-pointer shadow-md self-start sm:self-center"
          >
            <LuPlus size={14} /> Nueva Cita
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        {loading ? (
          <p className="text-secondary text-center font-medium p-8 text-sm">
            Cargando agenda...
          </p>
        ) : error ? (
          <p className="text-red-600 text-center font-medium p-8 text-sm">
            {error}
          </p>
        ) : (
          <div style={{ height: 650 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
              view={currentView}
              onView={setCurrentView}
              date={currentDate}
              onNavigate={setCurrentDate}
              eventPropGetter={eventPropGetter}
              messages={{
                next: "Sig.",
                previous: "Ant.",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                noEventsInRange: "No hay citas en este rango.",
              }}
            />
          </div>
        )}
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchAppointments}
      />
    </div>
  );
};

export default Agenda;
