import React, { useState, useEffect } from "react";
import { LuX, LuPlus, LuTrash2, LuBanknote } from "react-icons/lu";
import api from "../services/api";
import {
  showLoading,
  closeAlert,
  showSuccess,
  showError,
} from "../utils/alerts";

const PAYMENT_METHODS = ["Efectivo", "Tarjeta", "Transferencia"];

const CheckoutModal = ({
  isOpen,
  appointment,
  onClose,
  onCompleted,
  onSkip,
}) => {
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && appointment) {
      setError("");
      setIsPartialPayment(false);
      setPartialAmount("");
      setPaymentMethod("Efectivo");

      const initialItem = appointment.service
        ? [
            {
              serviceId: appointment.service.serviceId,
              name: appointment.service.name,
              unitPrice:
                appointment.service.promoPrice ||
                appointment.service.regularPrice ||
                0,
              discountPercent: 0,
            },
          ]
        : [];
      setItems(initialItem);

      const fetchServices = async () => {
        try {
          const response = await api.get(
            `/services?brand=${encodeURIComponent(appointment.marca)}`,
          );
          setServices(response.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchServices();
    }
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value || 0);

  const totalAmount = items.reduce((sum, item) => {
    const unit = Number(item.unitPrice) || 0;
    const discount = Number(item.discountPercent) || 0;
    return sum + unit * (1 - discount / 100);
  }, 0);

  const amountToCharge = isPartialPayment
    ? Number(partialAmount) || 0
    : totalAmount;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { serviceId: "", name: "", unitPrice: 0, discountPercent: 0 },
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      if (field === "serviceId") {
        const selectedService = services.find(
          (s) => s.serviceId === Number(value),
        );
        updated[index] = {
          ...updated[index],
          serviceId: Number(value),
          name: selectedService?.name || "",
          unitPrice:
            selectedService?.promoPrice || selectedService?.regularPrice || 0,
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleConfirm = async () => {
    if (items.length === 0 || items.some((i) => !i.serviceId)) {
      setError("Selecciona al menos un servicio válido para la venta");
      return;
    }

    if (isPartialPayment && (!partialAmount || Number(partialAmount) <= 0)) {
      setError("Ingresa un monto válido para el pago parcial");
      return;
    }

    setLoading(true);
    setError("");
    showLoading("Registrando venta...");

    try {
      const response = await api.post("/sales", {
        appointmentId: appointment.appointmentId,
        items: items.map((i) => ({
          serviceId: i.serviceId,
          unitPrice: i.unitPrice,
          discountPercent: i.discountPercent || 0,
        })),
        amountPaid: amountToCharge,
        paymentMethod,
      });
      closeAlert();
      showSuccess("Venta registrada", `Folio ${response.data.folio}`);
      onCompleted(response.data);
    } catch (err) {
      closeAlert();
      const msg = err.response?.data?.message || "Error al registrar la venta";
      setError(msg);
      showError("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col text-left">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <LuBanknote size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">
                Cobrar Servicio
              </h2>
              <p className="text-xs text-accent">
                {appointment.customer?.name || "Cliente"} · {appointment.marca}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-accent hover:text-primary text-sm font-bold cursor-pointer"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 text-center">
              {error}
            </p>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-primary uppercase">
                Servicios vendidos
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs font-semibold text-secondary hover:underline cursor-pointer"
              >
                <LuPlus size={14} /> Agregar servicio
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50/70 rounded-xl p-3 border border-gray-100"
                >
                  <select
                    value={item.serviceId}
                    onChange={(e) =>
                      handleItemChange(index, "serviceId", e.target.value)
                    }
                    className="flex-1 px-3 py-2 rounded-lg border border-borderClinik text-xs bg-white focus:outline-none focus:border-secondary"
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map((s) => (
                      <option key={s.serviceId} value={s.serviceId}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                    className="w-24 px-2 py-2 rounded-lg border border-borderClinik text-xs focus:outline-none focus:border-secondary"
                    placeholder="Precio"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.discountPercent}
                    onChange={(e) =>
                      handleItemChange(index, "discountPercent", e.target.value)
                    }
                    className="w-16 px-2 py-2 rounded-lg border border-borderClinik text-xs focus:outline-none focus:border-secondary"
                    placeholder="% Desc"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1.5 text-accent hover:text-red-500 transition-colors cursor-pointer shrink-0"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="text-xs font-bold text-primary uppercase mb-2 block">
              Método de pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                    paymentMethod === method
                      ? "bg-secondary text-white border-secondary"
                      : "border-borderClinik text-primary hover:bg-gray-50"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer select-none mb-3">
              <input
                type="checkbox"
                checked={isPartialPayment}
                onChange={(e) => setIsPartialPayment(e.target.checked)}
                className="accent-secondary h-4 w-4 rounded border-borderClinik"
              />
              Registrar pago parcial (dejar saldo pendiente)
            </label>

            {isPartialPayment && (
              <input
                type="number"
                step="0.01"
                min="0"
                max={totalAmount}
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                placeholder="Monto que paga ahora"
                className="w-full px-4 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary"
              />
            )}
          </div>

          <div className="bg-secondary/5 rounded-xl p-4 flex flex-col gap-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-accent font-medium">
                Total del servicio
              </span>
              <span className="font-bold text-primary">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-accent font-medium">Se cobra ahora</span>
              <span className="font-bold text-emerald-600">
                {formatCurrency(amountToCharge)}
              </span>
            </div>
            {isPartialPayment && (
              <div className="flex justify-between text-sm">
                <span className="text-accent font-medium">Saldo pendiente</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(totalAmount - amountToCharge)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 bg-gray-50/70 flex justify-between gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2.5 rounded-full border border-borderClinik text-xs font-semibold text-primary hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cobrar después
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Confirmar Cobro"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
