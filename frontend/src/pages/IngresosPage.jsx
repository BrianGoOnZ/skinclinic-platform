import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import {
  LuSearch,
  LuEye,
  LuFilter,
  LuDownload,
  LuWallet,
} from "react-icons/lu";
import SaleDetailModal from "../components/SaleDetailModal";
import { showLoading, closeAlert, showError } from "../utils/alerts";

const STATUS_COLORS = {
  Liquidada: "bg-emerald-50 text-emerald-600",
  "Con adeudo": "bg-amber-50 text-amber-600",
  Cancelada: "bg-red-50 text-red-600",
};

// Calcula el rango de un mes respetando la regla de negocio:
// - Mes anterior/cerrado -> día 1 al último día del mes
// - Mes actual -> día 1 al día de hoy (nunca fechas futuras)
const getExportRangeForMonth = (yearMonthStr) => {
  const [year, month] = yearMonthStr.split("-").map(Number);
  const now = new Date();
  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1;

  const from = `${yearMonthStr}-01`;
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const toDay = isCurrentMonth ? now.getDate() : lastDayOfMonth;
  const to = `${yearMonthStr}-${String(toDay).padStart(2, "0")}`;

  return { from, to };
};

const getCurrentMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { from, to, year, month };
};

const IngresosPage = () => {
  const defaultRange = getCurrentMonthRange();

  const [sales, setSales] = useState([]);
  const [pendingSales, setPendingSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeTab, setActiveTab] = useState("historial");

  const [marca, setMarca] = useState("");
  const [dateFrom, setDateFrom] = useState(defaultRange.from);
  const [dateTo, setDateTo] = useState(defaultRange.to);
  const [search, setSearch] = useState("");

  const [exportMonth, setExportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [summary, setSummary] = useState({
    totalIncome: 0,
    pendingBalance: 0,
    completedSales: 0,
    totalSales: 0,
  });

  const [selectedSale, setSelectedSale] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/sales", {
        params: {
          marca: marca || undefined,
          dateFrom,
          dateTo,
          search: search || undefined,
          page,
          limit: 25,
        },
      });
      setSales(response.data.sales);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (err) {
      setError("No se pudo cargar el historial de ingresos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [marca, dateFrom, dateTo, search, page]);

  const fetchPendingAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/sales/pending-accounts", {
        params: {
          marca: marca || undefined,
          search: search || undefined,
        },
      });
      setPendingSales(response.data);
      setError("");
    } catch (err) {
      setError("No se pudieron cargar las cuentas por cobrar.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [marca, search]);

  const fetchSummary = useCallback(async () => {
    try {
      const [year, month] = dateFrom.split("-");
      const response = await api.get("/sales/monthly-summary", {
        params: { year, month, marca: marca || undefined },
      });
      setSummary(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [dateFrom, marca]);

  useEffect(() => {
    if (activeTab === "historial") {
      fetchSales();
    } else {
      fetchPendingAccounts();
    }
  }, [activeTab, fetchSales, fetchPendingAccounts]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    setPage(1);
  }, [marca, dateFrom, dateTo, search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === "historial") {
        fetchSales();
      } else {
        fetchPendingAccounts();
      }
    }, 350);
    return () => clearTimeout(timeoutId);
  }, [search, activeTab, fetchSales, fetchPendingAccounts]);

  const handleOpenDetail = async (saleId) => {
    try {
      setDetailLoading(true);
      const response = await api.get(`/sales/${saleId}`);
      setSelectedSale(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value || 0);

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleExportPdf = async () => {
    const { from, to } = getExportRangeForMonth(exportMonth);

    try {
      showLoading("Generando reporte PDF...");

      const response = await api.get("/sales/export-pdf", {
        params: {
          marca: marca || undefined,
          dateFrom: from,
          dateTo: to,
          search: search || undefined,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte-ingresos-${exportMonth}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      closeAlert();
    } catch (err) {
      closeAlert();
      console.error(err);
      showError(
        "Error",
        "No se pudo generar el reporte PDF. Intenta de nuevo.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-bold text-accent shrink-0">
          <LuFilter size={14} /> Filtros
        </div>

        <select
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="px-3 py-2 rounded-xl border border-borderClinik text-xs font-semibold bg-white focus:outline-none focus:border-secondary"
        >
          <option value="">Todas las marcas</option>
          <option value="Modelha DK">Modelha DK</option>
          <option value="Depilclinik">Depilclinik</option>
        </select>

        {activeTab === "historial" && (
          <>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 rounded-xl border border-borderClinik text-xs font-semibold focus:outline-none focus:border-secondary"
            />
            <span className="text-xs text-accent">a</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 rounded-xl border border-borderClinik text-xs font-semibold focus:outline-none focus:border-secondary"
            />
          </>
        )}

        <div className="relative flex-1 min-w-50">
          <LuSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-accent"
          />
          <input
            type="text"
            placeholder="Buscar por folio o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-borderClinik text-xs focus:outline-none focus:border-secondary bg-white"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            type="month"
            value={exportMonth}
            max={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`}
            onChange={(e) => setExportMonth(e.target.value)}
            className="px-3 py-2 rounded-xl border border-borderClinik text-xs font-semibold focus:outline-none focus:border-secondary"
            title="Mes a exportar"
          />
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            <LuDownload size={14} /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-bold text-accent uppercase mb-1">
            Ingresos del mes
          </p>
          <p className="text-2xl font-black text-secondary">
            {formatCurrency(summary.totalIncome)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-bold text-accent uppercase mb-1">
            Saldos pendientes
          </p>
          <p className="text-2xl font-black text-amber-600">
            {formatCurrency(summary.pendingBalance)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-bold text-accent uppercase mb-1">
            Ventas concluidas
          </p>
          <p className="text-2xl font-black text-primary">
            {summary.completedSales}{" "}
            <span className="text-sm font-semibold text-accent">
              / {summary.totalSales}
            </span>
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab("historial")}
          className={`px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer ${
            activeTab === "historial"
              ? "bg-secondary text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Historial General
        </button>
        <button
          onClick={() => setActiveTab("cuentasPorCobrar")}
          className={`px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "cuentasPorCobrar"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
          }`}
        >
          <LuWallet size={15} /> Cuentas por Cobrar
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-secondary text-center font-medium p-8 text-sm">
            Cargando transacciones...
          </p>
        ) : error ? (
          <p className="text-red-600 text-center font-medium p-8 text-sm">
            {error}
          </p>
        ) : activeTab === "cuentasPorCobrar" ? (
          pendingSales.length === 0 ? (
            <p className="text-accent text-center font-medium p-8 text-sm">
              ¡Excelente! No hay clientes con saldos pendientes por cobrar.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-175">
                <thead>
                  <tr className="border-b border-amber-100 bg-amber-50/50">
                    <th className="p-4 text-xs font-bold text-amber-900">
                      Folio
                    </th>
                    <th className="p-4 text-xs font-bold text-amber-900">
                      Fecha
                    </th>
                    <th className="p-4 text-xs font-bold text-amber-900">
                      Cliente
                    </th>
                    <th className="p-4 text-xs font-bold text-amber-900">
                      Total Venta
                    </th>
                    <th className="p-4 text-xs font-bold text-amber-900">
                      Abonado
                    </th>
                    <th className="p-4 text-xs font-bold text-amber-900">
                      Saldo Pendiente
                    </th>
                    <th className="p-4 text-xs font-bold text-amber-900 text-right">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100/60">
                  {pendingSales.map((sale) => {
                    const balance =
                      parseFloat(sale.totalAmount) -
                      parseFloat(sale.amountPaid);
                    return (
                      <tr
                        key={sale.saleId}
                        className="hover:bg-amber-50/40 transition-colors"
                      >
                        <td className="p-4 text-sm font-semibold text-primary">
                          {sale.folio}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {formatDate(sale.createdAt || sale.created_at)}
                        </td>
                        <td className="p-4 text-sm text-primary font-medium">
                          {sale.customer?.name || "—"}
                          <p className="text-xs text-accent">
                            {sale.customer?.phone}
                          </p>
                        </td>
                        <td className="p-4 text-sm font-bold text-primary">
                          {formatCurrency(sale.totalAmount)}
                        </td>
                        <td className="p-4 text-sm font-bold text-emerald-600">
                          {formatCurrency(sale.amountPaid)}
                        </td>
                        <td className="p-4 text-sm font-bold text-red-600">
                          {formatCurrency(balance)}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleOpenDetail(sale.saleId)}
                            disabled={detailLoading}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            Abonar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : sales.length === 0 ? (
          <p className="text-accent text-center font-medium p-8 text-sm">
            No se encontraron transacciones en este rango.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-175">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="p-4 text-xs font-bold text-primary">Folio</th>
                  <th className="p-4 text-xs font-bold text-primary">Fecha</th>
                  <th className="p-4 text-xs font-bold text-primary">
                    Cliente
                  </th>
                  <th className="p-4 text-xs font-bold text-primary">
                    Tratamiento
                  </th>
                  <th className="p-4 text-xs font-bold text-primary">Monto</th>
                  <th className="p-4 text-xs font-bold text-primary">Estado</th>
                  <th className="p-4 text-xs font-bold text-primary text-right">
                    Ver
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sales.map((sale) => (
                  <tr
                    key={sale.saleId}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 text-sm font-semibold text-primary">
                      {sale.folio}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {formatDate(sale.createdAt || sale.created_at)}
                    </td>
                    <td className="p-4 text-sm text-primary font-medium">
                      {sale.customer?.name || "—"}
                    </td>
                    <td className="p-4 text-sm text-gray-600 max-w-50 truncate">
                      {sale.items
                        ?.map((i) => i.service?.name)
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td className="p-4 text-sm font-bold text-primary">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_COLORS[sale.status]}`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(sale.saleId)}
                        disabled={detailLoading}
                        className="p-1.5 text-accent hover:text-secondary transition-colors cursor-pointer disabled:opacity-50"
                        title="Ver detalle"
                      >
                        <LuEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "historial" && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full border border-borderClinik text-xs font-semibold text-primary hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-xs font-semibold text-accent">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-full border border-borderClinik text-xs font-semibold text-primary hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      <SaleDetailModal
        isOpen={Boolean(selectedSale)}
        sale={selectedSale}
        onClose={() => setSelectedSale(null)}
        onPaymentSuccess={async (saleId) => {
          await handleOpenDetail(saleId);
          if (activeTab === "cuentasPorCobrar") {
            fetchPendingAccounts();
          } else {
            fetchSales();
          }
          fetchSummary();
        }}
      />
    </div>
  );
};

export default IngresosPage;
