"use client";

import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, Clock, ShieldAlert, RefreshCw, Zap } from "lucide-react";

interface TransactionJob {
  _id: string;
  title: string;
  studioName: string;
  status: "active" | "pending";
  paymentId?: string;
  couponCode?: string;
  price?: number;
  createdAt: string;
}

export default function AdminTransaccionesPage() {
  const [jobs, setJobs] = useState<TransactionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("Error al cargar transacciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleForceApprove = async (jobId: string) => {
    if (!confirm("¿Deseas aproboar y activar manualmente esta publicación?")) return;
    setActionLoading(jobId);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId, status: "active" }),
      });

      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, status: "active" } : j))
        );
      }
    } catch (err) {
      console.error("Error al forzar activación:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingPayments = jobs.filter((j) => j.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Auditoría de Pagos & Webhooks</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Supervisá cobros de Mercado Pago y fuerza la sincronización manual si un callback falló.
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {/* Warning Banner for Pending Payments */}
      {pendingPayments.length > 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-200">
                Hay {pendingPayments.length} publicaciones pendientes de aprobación o pago
              </p>
              <p className="text-xs text-amber-400/80">
                Si un usuario reporta que pagó pero su aviso no aparece activo, podés usar el botón de activación manual.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-sm">Cargando transacciones...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm">No hay transacciones registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Aviso & Estudio</th>
                  <th className="px-6 py-4">Método de Pago / Cupón</th>
                  <th className="px-6 py-4">ID Transacción MP</th>
                  <th className="px-6 py-4">Estado del Pago</th>
                  <th className="px-6 py-4 text-right">Acción Correctiva</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-zinc-950/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white truncate max-w-xs">{job.title}</div>
                      <div className="text-xs text-zinc-400">{job.studioName}</div>
                    </td>

                    <td className="px-6 py-4">
                      {job.couponCode ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800/60 rounded">
                          Cupón: {job.couponCode}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-300">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Mercado Pago Directo
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                      {job.paymentId ? job.paymentId : "N/A (Cupón o Pendiente)"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          job.status === "active"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : "bg-amber-950 text-amber-300 border-amber-800"
                        }`}
                      >
                        {job.status === "active" ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Aprobado / Activo
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-400" /> Pendiente
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {job.status === "pending" && (
                        <button
                          onClick={() => handleForceApprove(job._id)}
                          disabled={actionLoading === job._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Activar Manualmente</span>
                        </button>
                      )}
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
