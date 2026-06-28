import React, { useState, useEffect } from "react";
import api from "../services/api";
import { LuSearch, LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";

const CustomersPage = ({ onOpenAddModal }) => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/customers");
        setCustomers(response.data);
        setError("");
      } catch (err) {
        setError("No se pudo conectar con el panel de clientes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-bold text-primary">
          Directorio de Clientes
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <LuSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent"
          />
          <input
            type="text"
            placeholder="Buscar Cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
          />
        </div>

        <button
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-bold text-xs hover:bg-[#14676f] transition-colors cursor-pointer shadow-md self-start sm:self-center"
          onClick={onOpenAddModal}
        >
          <LuPlus size={14} /> Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-secondary text-center font-medium p-8 text-sm">
            Cargando clientes...
          </p>
        ) : error ? (
          <p className="text-red-600 text-center font-medium p-8 text-sm">
            {error}
          </p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-accent text-center font-medium p-8 text-sm">
            No se encontraron clientes registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="p-4 text-xs font-bold text-primary w-[30%]">
                    Cliente
                  </th>
                  <th className="p-4 text-xs font-bold text-primary w-[30%]">
                    Contacto
                  </th>
                  <th className="p-4 text-xs font-bold text-primary w-[15%]">
                    Género
                  </th>
                  <th className="p-4 text-xs font-bold text-primary w-[15%]">
                    Fecha Registro
                  </th>
                  <th className="p-4 text-xs font-bold text-primary w-[10%] text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer, index) => (
                  <tr
                    key={customer.customer_id || index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-sm font-semibold text-primary block">
                        {customer.name}
                      </span>
                    </td>
                    <td className="p-4 vertical-middle">
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-primary">
                          {customer.phone}
                        </span>
                        <span className="text-xs text-accent truncate">
                          {customer.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 vertical-middle">
                      <span className="text-sm text-primary">
                        {customer.gender === "H"
                          ? "Hombre"
                          : customer.gender === "M"
                            ? "Mujer"
                            : "ND"}
                      </span>
                    </td>
                    <td className="p-4 vertical-middle">
                      <span className="text-sm text-primary">
                        {new Date(
                          customer.createdAt ||
                            customer.created_at ||
                            customer.date_registered ||
                            Date.now(),
                        ).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="p-4 text-right vertical-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-accent hover:text-secondary transition-colors cursor-pointer">
                          <LuPencil size={16} />
                        </button>
                        <button className="p-1.5 text-accent hover:text-red-600 transition-colors cursor-pointer">
                          <LuTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
