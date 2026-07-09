import React from "react";
import { LuSearch, LuBell } from "react-icons/lu";

const Navbar = ({ userName, pageTitle }) => {
  const isDashboard = !pageTitle;

  return (
    <header className="sticky top-0 z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-5 bg-[#f4f8f9] border-b border-gray-200/70 gap-4 w-full">
      <div className="text-left">
        {isDashboard ? (
          <>
            <h2 className="text-xl font-bold text-primary">
              Hola {userName || "Usuario"},
            </h2>
            <p className="text-sm text-accent font-medium mt-0.5">
              Bienvenida de vuelta al panel administrativo
            </p>
          </>
        ) : (
          <h2 className="text-xl font-bold text-primary">{pageTitle}</h2>
        )}
      </div>

      <div className="flex items-center gap-6 ml-auto sm:ml-0">
        <div className="bg-white rounded-full px-[18px] py-2.5 flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-borderClinik/20">
          <span className="mr-2.5 text-accent flex items-center">
            <LuSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar..."
            className="border-none outline-none text-sm w-40 bg-transparent text-secondary placeholder-accent/60"
          />
        </div>

        <div className="cursor-pointer text-secondary flex items-center relative p-1 hover:text-primary transition-colors">
          <LuBell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150')] bg-cover bg-center"></div>
          <span className="text-sm font-bold text-primary hidden sm:block">
            {userName?.split(" ")[0] || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
