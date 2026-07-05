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

const Sidebar = ({ activeView, setActiveView, onLogout, userRole }) => {
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
      <div className="p-6 flex items-center justify-start">
        <span className="text-xl font-black tracking-wider text-secondary flex items-center gap-1">
          DEP<span className="text-primary font-light">I</span>L CLINIK
        </span>
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
        {visibleItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-gray-500 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="p-4 flex flex-col gap-1 border-t border-gray-50">
        <div
          onClick={() => setActiveView("ajustes")}
          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
            activeView === "ajustes"
              ? "bg-primary text-white"
              : "text-gray-500 hover:bg-gray-50 hover:text-primary"
          }`}
        >
          <span>
            <LuSettings size={20} />
          </span>
          <span>Ajustes</span>
        </div>

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
