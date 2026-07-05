import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Employees from "./Employees";
import CustomersPage from "./CustomersPage";
import AddCustomerModal from "../components/AddCustomerModal";
import Agenda from "./Agenda";

const DashboardPage = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshCustomers = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const renderContent = () => {
    switch (activeView) {
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
        return (
          <CustomersPage
            key={refreshKey}
            onOpenAddModal={() => setIsModalOpen(true)}
          />
        );

      case "agenda":
        return <Agenda currentUserRole={user?.role} />;

      case "dashboard":
        return (
          <div className="flex flex-col gap-6 w-full text-left">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-3 ${
                  user?.role === "Administrador"
                    ? "bg-red-50 text-red-700 border border-red-100"
                    : "bg-blue-50 text-secondary border border-blue-100"
                }`}
              >
                {user?.role === "Administrador"
                  ? "Dashboard Administrador"
                  : "Dashboard Colaborador"}
              </span>
              <p className="text-sm text-accent font-medium">
                Este panel está en construcción. Los módulos de Ingresos y
                Rendimiento se conectarán aquí una vez completados.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
            Sección {activeView} en desarrollo.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f4f8f9] text-gray-800 font-sans antialiased">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={onLogout}
        userRole={user?.role}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} />
        <main className="flex-1 p-6 pt-2 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={handleRefreshCustomers}
      />
    </div>
  );
};

export default DashboardPage;
