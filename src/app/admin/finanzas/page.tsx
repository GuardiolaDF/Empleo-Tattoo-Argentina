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
      <div className="p-12 text-center text-zinc-500 text-sm">
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Control Financiero</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Registro de ingresos por publicación de avisos y uso de cupones.
          </p>
        </div>
        <button
          onClick={fetchFinance}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Ingresos Totales (ARS)</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-extrabold text-white">${data.totalRevenue.toLocaleString("es-AR")}</p>
            <p className="text-xs text-zinc-400 mt-2">
              Monto total recaudado desde el inicio de operaciones.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Ingresos del Mes (ARS)</span>
            <div className="w-9 h-9 rounded-lg bg-orange-950/80 text-orange-400 flex items-center justify-center border border-orange-800/60">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-extrabold text-white">${data.monthlyRevenue.toLocaleString("es-AR")}</p>
            <p className="text-xs text-zinc-400 mt-2">
              Recaudación en el mes calendario actual.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por estudio, puesto o cupón..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm">No se encontraron transacciones.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Estudio & Aviso</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Método / Cupón</th>
                  <th className="px-6 py-4 text-right">Monto (ARS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-950/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{tx.studioName}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{tx.title}</div>
                    </td>

                    <td className="px-6 py-4 text-zinc-400">
                      {new Date(tx.date).toLocaleDateString("es-AR", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>

                    <td className="px-6 py-4">
                      {tx.couponCode ? (
                        <span className="inline-flex items-center gap-1 text-xs text-purple-400 bg-purple-950/40 px-2 py-1 rounded border border-purple-900/50">
                          <Tag className="w-3.5 h-3.5" />
                          {tx.couponCode}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/50">
                          <CreditCard className="w-3.5 h-3.5" />
                          MercadoPago
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className={`font-semibold ${tx.amount > 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        ${tx.amount.toLocaleString("es-AR")}
                      </span>
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
}
