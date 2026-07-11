import React from "react";
import {
  LuLayoutDashboard,
  LuBriefcase,
  LuCalendarDays,
  LuUser,
  LuUsers,
  LuCreditCard,
  LuLogOut,
} from "react-icons/lu";

const getInitials = (name) => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  return words
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Sidebar = ({
  activeView,
  setActiveView,
  onLogout,
  userRole,
  userName,
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LuLayoutDashboard size={20} />,
    },
    { id: "servicios", label: "Servicios", icon: <LuBriefcase size={20} /> },
    { id: "agenda", label: "Agenda", icon: <LuCalendarDays size={20} /> },
    { id: "clientes", label: "Clientes", icon: <LuUser size={20} /> },
    {
      id: "empleados",
      label: "Empleados",
      icon: <LuUsers size={20} />,
      adminOnly: true,
    },
    {
      id: "ingresos",
      label: "Ingresos",
      icon: <LuCreditCard size={20} />,
      adminOnly: true,
    },
  ];

  const visibleItems = menuItems.filter(
    (item) => !item.adminOnly || userRole === "Administrador",
  );

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col shrink-0 sticky top-0">
      <div className="px-6 py-6 flex flex-col items-center text-center gap-2 border-b border-gray-50 bg-gradient-to-br from-secondary/10 via-white to-depil/10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-depil flex items-center justify-center text-white font-black text-lg shadow-md">
          {getInitials(userName)}
        </div>
        <div>
          <p className="text-sm font-bold text-primary truncate max-w-[180px]">
            {userName || "Usuario"}
          </p>
          <p className="text-[11px] font-bold text-gold uppercase tracking-wide mt-0.5">
            {userRole || "Colaborador"}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
                isActive
                  ? "bg-gradient-to-r from-secondary to-depil text-white shadow-md shadow-depil/20"
                  : "text-gray-500 hover:bg-secondary/5 hover:text-secondary"
              }`}
            >
              <span className={isActive ? "text-white" : "text-accent"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <div
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left text-gray-500 hover:bg-red-50 hover:text-red-600"
        >
          <span>
            <LuLogOut size={20} />
          </span>
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
