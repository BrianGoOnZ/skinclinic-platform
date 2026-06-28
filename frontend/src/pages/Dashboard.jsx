import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Employees from "./Employees";
import CustomersPage from "./CustomersPage";
import AddCustomerModal from "../components/AddCustomerModal";

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
        return <Employees />;
      case "clientes":
        return (
          <CustomersPage
            key={refreshKey}
            onOpenAddModal={() => setIsModalOpen(true)}
          />
        );
      case "dashboard":
        return (
          <div className="flex flex-col gap-6 w-full text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <p className="text-xs font-bold text-accent tracking-wide uppercase">
                  Ingresos (día)
                </p>
                <p className="text-2xl font-black text-primary mt-2">
                  $4,500.00
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <p className="text-xs font-bold text-accent tracking-wide uppercase">
                  Clientes atendidos
                </p>
                <p className="text-2xl font-black text-primary mt-2">10</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <p className="text-xs font-bold text-accent tracking-wide uppercase">
                  Clientes nuevos
                </p>
                <p className="text-2xl font-black text-primary mt-2">5</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <p className="text-xs font-bold text-accent tracking-wide uppercase">
                  Citas del día
                </p>
                <p className="text-2xl font-black text-primary mt-2">12</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[220px]">
                <h3 className="text-sm font-bold text-secondary tracking-wide uppercase mb-4">
                  Tratamientos populares
                </h3>
                <div className="flex justify-between items-end h-32 px-4 pt-4">
                  <div className="flex flex-col items-center gap-2 w-12">
                    <div className="bg-red-100 w-6 h-24 rounded-t-md"></div>
                    <span className="text-[10px] font-bold text-accent">
                      Laser
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-12">
                    <div className="bg-red-100 w-6 h-14 rounded-t-md"></div>
                    <span className="text-[10px] font-bold text-accent">
                      Facial
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-12">
                    <div className="bg-red-100 w-6 h-18 rounded-t-md"></div>
                    <span className="text-[10px] font-bold text-accent">
                      Cuerpo
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-12">
                    <div className="bg-red-100 w-6 h-26 rounded-t-md"></div>
                    <span className="text-[10px] font-bold text-accent">
                      Masajes
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[220px]">
                <h3 className="text-sm font-bold text-secondary tracking-wide uppercase mb-4">
                  Rendimientos empleados
                </h3>
                <div className="flex justify-between items-end h-32 px-2 pt-4">
                  <div className="flex flex-col items-center gap-2 w-10">
                    <div className="bg-red-100 w-5 h-16 rounded-t-md"></div>
                    <span className="text-[10px] font-bold text-accent truncate max-w-full">
                      Karelia
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-10">
                    <div className="bg-red-100 w-5 h-12 rounded-t-md"></div>
                    <span className="text-[10px] font-bold text-accent truncate max-w-full">
                      Fernanda
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-10">
                    <div className="bg-red-100 w-5 h-10 rounded-t-md"></div>
                    <span className="text-[10px] font-bold text-accent truncate max-w-full">
                      Andrea
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-10">
                    <div className="bg-red-100 w-5 h-4 rounded-t-md"></div>
                    <span className="text-[10px] font-bold text-accent truncate max-w-full">
                      Juanita
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-10">
                    <div className="bg-red-100 w-5 h-2 rounded-t-md"></div>
                    <span className="text-[10px] font-bold text-accent truncate max-w-full">
                      Juliana
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-secondary tracking-wide uppercase mb-4">
                  Próximas citas
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-accent border-b border-gray-100">
                        <th className="pb-2 font-bold">Hora</th>
                        <th className="pb-2 font-bold">Cliente</th>
                        <th className="pb-2 font-bold">Servicio</th>
                        <th className="pb-2 font-bold text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr>
                        <td className="py-3 font-semibold text-primary">
                          10:00 am
                        </td>
                        <td className="py-3 text-gray-600 font-medium">
                          María García
                        </td>
                        <td className="py-3 text-gray-500">Láser Piernas</td>
                        <td className="py-3 text-right font-bold text-secondary">
                          Confirmado
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold text-primary">
                          11:30 am
                        </td>
                        <td className="py-3 text-gray-600 font-medium">
                          Roberto Ruíz
                        </td>
                        <td className="py-3 text-gray-500">Limpieza Facial</td>
                        <td className="py-3 text-right font-bold text-red-300">
                          Pendiente
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
                <h3 className="text-sm font-bold text-secondary tracking-wide uppercase mb-2">
                  Recordatorios
                </h3>

                <div className="flex items-start gap-3 p-3 bg-blue-50/40 border-l-4 border-secondary rounded-r-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary">
                      Confirmar cita a las 4:00 pm
                    </span>
                    <span className="text-[11px] text-secondary font-medium mt-0.5">
                      Cliente: Sara P. (láser completo)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50/40 border-l-4 border-secondary rounded-r-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary">
                      Revisar corte de caja matutino
                    </span>
                    <span className="text-[11px] text-accent font-medium mt-0.5">
                      Pendiente de revisar
                    </span>
                  </div>
                </div>
              </div>
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
