import { useState, useEffect } from "react";
import api from "../services/api";
import { showToast } from "../utils/alerts";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Employees from "./Employees";
import CustomersPage from "./CustomersPage";
import Agenda from "./Agenda";
import ServicesPage from "./ServicesPage";
import AssessmentHistoryPage from "./AssessmentHistoryPage";
import IngresosPage from "./IngresosPage";
import DashboardHome from "./DashboardPage";
import CollaboratorDashboard from "./CollaboratorDashboard";

const PAGE_TITLES = {
  empleados: "Gestión de Colaboradores",
  clientes: "Directorio de Clientes",
  "historial-expedientes": "Historial de Expedientes",
  agenda: "Agenda",
  servicios: "Catálogo de Servicios",
  ingresos: "Ingresos",
};

const DashboardPage = ({ user, onLogout, onAttendAppointment }) => {
  const [activeView, setActiveView] = useState("dashboard");

  const [pendingCheckoutCount, setPendingCheckoutCount] = useState(0);

  const fetchPendingCheckouts = async () => {
    if (user?.role !== "Administrador") return;
    try {
      const response = await api.get("/appointments/pending-checkouts");
      setPendingCheckoutCount(response.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingCheckouts();
    const interval = setInterval(fetchPendingCheckouts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = () => {
    if (pendingCheckoutCount === 0) {
      showToast("info", "No tienes cobros pendientes");
      return;
    }
    setActiveView("agenda");
    showToast(
      "warning",
      `Tienes ${pendingCheckoutCount} cita(s) marcadas en rojo esperando cobro en tu Agenda`,
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        if (user?.role !== "Administrador") {
          return (
            <CollaboratorDashboard
              userRole={user?.role}
              userName={user?.name}
            />
          );
        }
        return <DashboardHome userRole={user?.role} />;

      case "empleados":
        if (user?.role !== "Administrador") {
          return (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
              No tienes permisos para acceder a esta sección.
            </div>
          );
        }
        return <Employees currentUserRole={user?.role} />;

      case "clientes":
        if (user?.role !== "Administrador") {
          return (
            <div className="bg-white rounded-2x1 border border-gray-200 p-8 text-center text-gray-400 text-sm">
              No tienes permisos para acceder a esta sección.
            </div>
          );
        }
        return <CustomersPage currentUserRole={user?.role} />;

      case "historial-expedientes":
        if (user?.role !== "Administrador") {
          return (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
              No tienes permisos para acceder a esta sección.
            </div>
          );
        }
        return <AssessmentHistoryPage />;

      case "agenda":
        return (
          <Agenda
            currentUserRole={user?.role}
            onAttendAppointment={onAttendAppointment}
          />
        );

      case "servicios":
        return <ServicesPage currentUserRole={user?.role} />;

      case "ingresos":
        if (user?.role !== "Administrador") {
          return (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
              No tienes permisos para acceder a esta sección.
            </div>
          );
        }
        return <IngresosPage />;

      default:
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
            Sección {activeView} en desarrollo.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#eef2f5] text-gray-800 font-sans antialiased">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={onLogout}
        userRole={user?.role}
        userName={user?.name}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          pageTitle={PAGE_TITLES[activeView]}
          pendingCheckoutCount={
            user?.role === "Administrador" ? pendingCheckoutCount : 0
          }
          onBellClick={
            user?.role === "Administrador" ? handleBellClick : undefined
          }
        />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
