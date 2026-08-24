"use client";

import { useEffect, useState } from "react";
import { DollarSign, Search, Calendar, RefreshCw, CreditCard, Tag } from "lucide-react";

interface Transaction {
  id: string;
  title: string;
  studioName: string;
  date: string;
  amount: number;
  couponCode: string | null;
  paymentId: string | null;
}

interface FinanceData {
  totalRevenue: number;
  monthlyRevenue: number;
  transactions: Transaction[];
}

export default function AdminFinanzasPage() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/finance");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error al cargar finanzas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-black font-bold uppercase text-sm">
        Cargando datos financieros...
      </div>
    );
  }

  const filteredTransactions = data.transactions.filter(
    (t) =>
      t.studioName.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.couponCode && t.couponCode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-black uppercase tracking-tight">Control Financiero</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mt-1">
            Registro de ingresos por publicación de avisos y uso de cupones.
          </p>
        </div>
        <button
          onClick={fetchFinance}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider">Ingresos Totales (ARS)</span>
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-gray-50">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-5xl font-black">${data.totalRevenue.toLocaleString("es-AR")}</p>
            <p className="text-xs font-bold uppercase text-muted-foreground mt-4">
              Monto total recaudado desde el inicio de operaciones.
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider">Ingresos del Mes (ARS)</span>
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-gray-50">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-5xl font-black">${data.monthlyRevenue.toLocaleString("es-AR")}</p>
            <p className="text-xs font-bold uppercase text-muted-foreground mt-4">
              Recaudación en el mes calendario actual.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-6 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Buscar por estudio, puesto o cupón..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border-2 border-black pl-10 pr-4 py-3 text-sm font-bold text-black placeholder-gray-500 focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-black font-bold uppercase text-sm">No se encontraron transacciones.</div>
        ) : (
          <>
            {/* Vista Mobile (Tarjetas) */}
            <div className="block xl:hidden mt-4 space-y-4">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="bg-gray-50 border-2 border-black p-4 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-black uppercase">{tx.studioName}</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{tx.title}</div>
                  </div>
                  <div className={`font-black text-lg ${tx.amount > 0 ? 'text-green-700' : 'text-gray-500'}`}>
                    ${tx.amount.toLocaleString("es-AR")}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Fecha:</span>
                    <div className="font-bold text-black uppercase">
                      {new Date(tx.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Método:</span>
                    <div className="mt-1">
                      {tx.couponCode ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-purple-900 bg-purple-100 px-2 py-0.5 border border-purple-900">
                          <Tag className="w-3 h-3" /> {tx.couponCode}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-green-800 bg-green-100 px-2 py-0.5 border border-green-800">
                          <CreditCard className="w-3 h-3" /> MP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vista Desktop (Tabla) */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full text-left text-sm text-black min-w-[700px]">
              <thead className="bg-gray-50 text-xs uppercase font-black text-black border-b-2 border-black">
                <tr>
                  <th className="px-6 py-4">Estudio & Aviso</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Método / Cupón</th>
                  <th className="px-6 py-4 text-right">Monto (ARS)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-black uppercase truncate max-w-[250px]">{tx.studioName}</div>
                      <div className="text-xs text-muted-foreground font-bold uppercase mt-1">{tx.title}</div>
                    </td>

                    <td className="px-6 py-4 text-black font-bold uppercase">
                      {new Date(tx.date).toLocaleDateString("es-AR", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>

                    <td className="px-6 py-4">
                      {tx.couponCode ? (
                        <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-purple-900 bg-purple-100 px-3 py-1 border-2 border-purple-900">
                          <Tag className="w-4 h-4" />
                          {tx.couponCode}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-green-800 bg-green-100 px-3 py-1 border-2 border-green-800">
                          <CreditCard className="w-4 h-4" />
                          MercadoPago
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className={`font-black text-lg ${tx.amount > 0 ? 'text-green-700' : 'text-gray-500'}`}>
                        ${tx.amount.toLocaleString("es-AR")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
        )}
      </div>
    </div>
  );
}
