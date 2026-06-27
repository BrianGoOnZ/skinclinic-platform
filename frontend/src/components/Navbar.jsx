import React from "react";
// Importamos los iconos profesionales correspondientes para el Navbar
import { LuSearch, LuBell } from "react-icons/lu";

const Navbar = ({ userName }) => {
  return (
    <header className="navbar">
      <div className="navbar-welcome">
        <h2>Hola {userName || "Usuario"},</h2>
        <p>Bienvenida de vuelta al panel administrativo</p>
      </div>

      <div className="navbar-actions">
        {/* Buscador Estilizado */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "50px",
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            border: "1px solid rgba(167, 207, 210, 0.2)",
          }}
        >
          {/* Icono de Lupa Profesional */}
          <span
            style={{
              marginRight: "10px",
              color: "#5B9FA6",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LuSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar..."
            style={{
              border: "none",
              outline: "none",
              fontSize: "14px",
              width: "160px",
              backgroundColor: "transparent",
              color: "#20828A",
            }}
          />
        </div>

        {/* Campana de Notificaciones Profesional */}
        <div
          style={{
            fontSize: "20px",
            cursor: "pointer",
            color: "#20828A",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <LuBell size={22} />
          {/* Puntito de notificación opcional por si quieres simular una activa como en Figma */}
          <span
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              width: "8px",
              height: "8px",
              backgroundColor: "#197E88",
              borderRadius: "50%",
            }}
          ></span>
        </div>

        {/* Perfil del Usuario Logueado */}
        <div className="user-profile">
          <div className="user-avatar"></div>
          <span className="user-name">
            {userName?.split(" ")[0] || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
