import React, { useState, useEffect, useRef } from "react";
import { LuSearch, LuUserPlus, LuX } from "react-icons/lu";
import api from "../services/api";
import QuickCustomerModal from "./QuickCustomerModal";

const CustomerAutocomplete = ({ value, onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value ? value.name : "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || (value && query === value.name) || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.get("/customers/search", {
          params: { q: query },
        });
        setResults(response.data);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSelect = (customer) => {
    onSelect(customer);
    setQuery(customer.name);
    setShowDropdown(false);
  };

  const handleClear = () => {
    onSelect(null);
    setQuery("");
    setResults([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <LuSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-accent"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (value) onSelect(null);
          }}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Busca por nombre o teléfono..."
          className="w-full pl-9 pr-9 py-2 rounded-xl border border-borderClinik text-sm focus:outline-none focus:border-secondary bg-white"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-red-500 cursor-pointer"
          >
            <LuX size={16} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-borderClinik rounded-xl shadow-lg max-h-56 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-xs text-accent p-3">Sin resultados.</p>
          ) : (
            results.map((c) => (
              <button
                type="button"
                key={c.customerId}
                onClick={() => handleSelect(c)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-primary cursor-pointer flex flex-col"
              >
                <span className="font-semibold">{c.name}</span>
                <span className="text-xs text-accent">{c.phone}</span>
              </button>
            ))
          )}
          <button
            type="button"
            onClick={() => {
              setIsQuickModalOpen(true);
              setShowDropdown(false);
            }}
            className="w-full flex items-center gap-2 text-left px-4 py-2.5 border-t border-gray-100 text-sm font-semibold text-secondary hover:bg-blue-50 cursor-pointer"
          >
            <LuUserPlus size={16} /> Registrar nuevo cliente
          </button>
        </div>
      )}

      <QuickCustomerModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
        onCreated={(newCustomer) => {
          handleSelect(newCustomer);
          setIsQuickModalOpen(false);
        }}
      />
    </div>
  );
};

export default CustomerAutocomplete;
