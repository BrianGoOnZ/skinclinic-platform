import React from "react";
import { LuBell } from "react-icons/lu";

const Navbar = ({ pageTitle, pendingCheckoutCount = 0, onBellClick }) => {
  const isDashboard = !pageTitle;

  return (
    <header className="relative sticky top-0 z-20 flex flex-row justify-between items-center px-6 py-5 bg-linear-to-r from-[#cbe4e6] via-[#e2eff1] to-[#f7d2e3] border-b border-gray-300 gap-4 w-full">
      <div className="text-left">
        {isDashboard ? (
          <span className="text-2xl font-black tracking-wider text-primary font-heading leading-none flex items-center gap-1.5">
            DEPILCLINIK
          </span>
        ) : (
          <h2 className="text-2xl font-bold text-primary font-heading leading-none">
            {pageTitle}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onBellClick && (
          <button
            onClick={onBellClick}
            className="relative p-2 rounded-full hover:bg-white/50 transition-colors cursor-pointer"
            title="Citas pendientes de cobro"
          >
            <LuBell size={22} className="text-primary" />
            {pendingCheckoutCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCheckoutCount > 9 ? "9+" : pendingCheckoutCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
