import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Employees from "./Employees"; // 👈 Importación correcta en inglés
import "../styles/Layout.css";

const DashboardPage = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="dashboard-layout">
      {/* Componente Modular Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={onLogout}
      />

      <div className="main-wrapper">
        {/* Componente Modular Navbar */}
        <Navbar userName={user?.name || user?.email} />

        {/* Contenido Central Cambiante (Inyección Dinámica) */}
        <main className="stage-content">
          {activeView === "dashboard" && (
            <div>
              <h3 style={{ color: "#20828A" }}>Vista de Métricas Generales</h3>
              <p>
                Aquí pintaremos el grid con los 4 recuadros blancos e ingresos
                ($4,500.00).
              </p>
            </div>
          )}

          {activeView === "clientes" && (
            <div>
              <h3 style={{ color: "#20828A" }}>Módulo de Clientes</h3>
              <p>Aquí vivirá el CRUD y la tabla conectada a MySQL.</p>
            </div>
          )}

          {/* ✨ Nueva vista real para empleados/colaboradores */}
          {activeView === "empleados" && <Employees />}

          {/* Marcadores de posición para las otras vistas (excluimos empleados) */}
          {activeView !== "dashboard" &&
            activeView !== "clientes" &&
            activeView !== "empleados" && (
              <div>
                <h3 style={{ color: "#20828A" }}>
                  Panel de {activeView.toUpperCase()}
                </h3>
                <p>Sección en desarrollo para la gestión interna.</p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
