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
      {/* ─── CONTENEDOR OPTIMIZADO PARA EL LOGO CORPORATIVO ─── */}
      <div
        className="sidebar-logo"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        {/* Espacio reservado para la imagen del logo */}
        <div
          className="logo-image-placeholder"
          style={{
            width: "180px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor:
              "transparent" /* Cambiar a fondo gris si quieres ver la caja temporalmente */,
            borderRadius: "8px",
          }}
        >
          {/* Cuando tenga el logo listo, descomentar la línea de abajo y borra el texto provisional */}
          {/* <img src="/assets/logo-depilclinik.svg" alt="Depil Clinik Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} /> */}
          <span
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#197E88",
              letterSpacing: "0.5px",
            }}
          >
            DEPILCLINIK
          </span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${activeView === item.id ? "active" : ""}`}
            onClick={() => setActiveView(item.id)}
          >
            <span
              className="menu-icon"
              style={{ display: "flex", alignItems: "center" }}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer del Sidebar */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div
          className={`menu-item ${activeView === "ajustes" ? "active" : ""}`}
          onClick={() => setActiveView("ajustes")}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <LuSettings size={20} />
          </span>
          <span>Ajustes</span>
        </div>

        <div
          className="menu-item"
          onClick={onLogout}
          style={{ color: "#d9534f" }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <LuLogOut size={20} />
          </span>
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
