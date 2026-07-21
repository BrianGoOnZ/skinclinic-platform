import React, { useState, useEffect, useRef } from "react";
import { LuBell, LuWallet, LuCalendar, LuX } from "react-icons/lu";
import api from "../services/api";

const NotificationDropdown = ({ onSelectSale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sales/pending-accounts");

      const pendingAlerts = response.data.map((sale) => ({
        id: sale.saleId,
        type: "pending_payment",
        title: "Cobro pendiente",
        description: `${sale.customer?.name || "Cliente"} tiene un saldo pendiente de $${(
          parseFloat(sale.totalAmount) - parseFloat(sale.amountPaid)
        ).toFixed(2)}`,
        date: sale.createdAt || sale.created_at,
        saleId: sale.saleId,
      }));

      setNotifications(pendingAlerts);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = (notif) => {
    setIsOpen(false);
    if (notif.type === "pending_payment" && onSelectSale) {
      onSelectSale(notif.saleId);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <LuBell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2">
              <LuBell size={16} className="text-secondary" /> Notificaciones
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
              {notifications.length} pendientes
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              <p className="p-4 text-xs text-center text-accent">Cargando...</p>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-accent">
                No tienes cobros u obligaciones pendientes por revisar.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className="p-3.5 hover:bg-amber-50/50 transition-colors cursor-pointer flex gap-3 items-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <LuWallet size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {notif.description}
                    </p>
                    <p className="text-[10px] text-accent mt-1">
                      Haz clic para abrir y abonar
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
