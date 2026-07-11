import React from "react";
import { LuBell } from "react-icons/lu";

const Navbar = ({ pageTitle }) => {
  const isDashboard = !pageTitle;

  return (
    <header className="relative sticky top-0 z-20 flex flex-row justify-between items-center px-6 py-5 bg-gradient-to-r from-[#e7f2f3] via-[#f4f8f9] to-[#fbe9f1] border-b border-gray-200/70 gap-4 w-full">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-secondary via-accent to-depil" />

      <div className="text-left">
        {isDashboard ? (
          <span className="text-xl font-black tracking-wider text-primary flex items-center gap-1.5">
            DEPILCLINIK
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </span>
        ) : (
          <h2 className="text-xl font-bold text-primary">{pageTitle}</h2>
        )}
      </div>

      <div className="flex items-center">
        <div className="cursor-pointer text-secondary flex items-center relative p-2 rounded-full hover:bg-white hover:text-primary transition-colors shadow-sm bg-white border border-depil/20">
          <LuBell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-depil rounded-full"></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
