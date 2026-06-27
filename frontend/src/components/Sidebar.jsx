import React from "react";
import {
  LuLayoutDashboard,
  LuBriefcase,
  LuCalendarDays,
  LuUser,
  LuUsers,
  LuCreditCard,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";

const Sidebar = ({ activeView, setActiveView, onLogout }) => {
  // Navigation structural elements configuration
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LuLayoutDashboard size={20} />,
    },
    { id: "servicios", label: "Servicios", icon: <LuBriefcase size={20} /> },
    { id: "agenda", label: "Agenda", icon: <LuCalendarDays size={20} /> },
    { id: "clientes", label: "Clientes", icon: <LuUser size={20} /> },
    { id: "empleados", label: "Empleados", icon: <LuUsers size={20} /> },
    { id: "ingresos", label: "Ingresos", icon: <LuCreditCard size={20} /> },
  ];

  return (
    <aside className="sidebar">
      {/* Corporate Identity Branding Container */}
      <div className="sidebar-logo">
        <div className="logo-image-placeholder">
          <span>DEPILCLINIK</span>
        </div>
      </div>

      {/* Main Administrative Navigation Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${activeView === item.id ? "active" : ""}`}
            onClick={() => setActiveView(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* System Utilities Footer Actions */}
      <div className="sidebar-footer">
        <div
          className={`menu-item ${activeView === "ajustes" ? "active" : ""}`}
          onClick={() => setActiveView("ajustes")}
        >
          <span className="menu-icon">
            <LuSettings size={20} />
          </span>
          <span>Ajustes</span>
        </div>

        <div className="menu-item logout-action" onClick={onLogout}>
          <span className="menu-icon">
            <LuLogOut size={20} />
          </span>
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
