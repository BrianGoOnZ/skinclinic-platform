import React from "react";

const Navbar = ({ pageTitle }) => {
  const isDashboard = !pageTitle;

  return (
    <header className="relative sticky top-0 z-20 flex flex-row justify-between items-center px-6 py-5 bg-gradient-to-r from-[#cbe4e6] via-[#e2eff1] to-[#f7d2e3] border-b border-gray-300 gap-4 w-full">
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

      <div className="flex items-center"></div>
    </header>
  );
};

export default Navbar;
