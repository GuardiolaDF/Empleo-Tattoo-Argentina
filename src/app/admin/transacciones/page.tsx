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
          <h1 className="text-display-sm font-black uppercase tracking-tight">Auditoría de Pagos & Webhooks</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mt-1">
            Supervisá cobros de Mercado Pago y fuerza la sincronización manual si un callback falló.
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {/* Warning Banner for Pending Payments */}
      {pendingPayments.length > 0 && (
        <div className="p-6 bg-yellow-100 border-2 border-yellow-800 flex items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4">
            <ShieldAlert className="w-8 h-8 text-yellow-800 flex-shrink-0" />
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-yellow-900">
                Hay {pendingPayments.length} publicaciones pendientes de aprobación o pago
              </p>
              <p className="text-xs font-bold uppercase text-yellow-800/80 mt-1">
                Si un usuario reporta que pagó pero su aviso no aparece activo, podés usar el botón de activación manual.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {loading ? (
          <div className="p-12 text-center text-black font-bold uppercase text-sm">Cargando transacciones...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-black font-bold uppercase text-sm">No hay transacciones registradas.</div>
        ) : (
          <>
            {/* Vista Mobile (Tarjetas) */}
            <div className="block xl:hidden mt-4 space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-gray-50 border-2 border-black p-4 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <div className="font-black uppercase">{job.title}</div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{job.studioName}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Método / Pago:</span>
                    <div className="mt-1">
                      {job.couponCode ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase bg-purple-100 text-purple-900 border border-purple-900">
                          Cupón: {job.couponCode}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-black">
                          <CreditCard className="w-3 h-3 text-green-700" /> Mercado Pago
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">ID Transacción:</span>
                    <div className="font-mono text-[10px] font-bold text-black uppercase mt-1">
                      {job.paymentId ? job.paymentId : "N/A (Cupón o Pdte)"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-black">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase border-2 ${
                      job.status === "active"
                        ? "bg-green-100 text-green-800 border-green-800"
                        : "bg-yellow-100 text-yellow-800 border-yellow-800"
                    }`}
                  >
                    {job.status === "active" ? (
                      <><CheckCircle2 className="w-3 h-3 text-green-800" /> Activo</>
                    ) : (
                      <><Clock className="w-3 h-3 text-yellow-800" /> Pendiente</>
                    )}
                  </span>

                  {job.status === "pending" && (
                    <button
                      onClick={() => handleForceApprove(job._id)}
                      disabled={actionLoading === job._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-black/80 text-white text-[10px] font-black uppercase tracking-wider transition-transform hover:translate-y-[-1px] border-2 border-transparent"
                    >
                      <Zap className="w-3 h-3" /> Activar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Vista Desktop (Tabla) */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full text-left text-sm text-black min-w-[800px]">
              <thead className="bg-gray-50 text-xs font-black uppercase text-black border-b-2 border-black">
                <tr>
                  <th className="px-6 py-4">Aviso & Estudio</th>
                  <th className="px-6 py-4">Método de Pago / Cupón</th>
                  <th className="px-6 py-4">ID Transacción MP</th>
                  <th className="px-6 py-4">Estado del Pago</th>
                  <th className="px-6 py-4 text-right">Acción Correctiva</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-black uppercase truncate max-w-[200px]">{job.title}</div>
                      <div className="text-xs text-muted-foreground font-bold uppercase mt-1">{job.studioName}</div>
                    </td>

                    <td className="px-6 py-4">
                      {job.couponCode ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-black uppercase bg-purple-100 text-purple-900 border-2 border-purple-900">
                          Cupón: {job.couponCode}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-black">
                          <CreditCard className="w-4 h-4 text-green-700" /> Mercado Pago Directo
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs font-bold text-muted-foreground uppercase">
                      {job.paymentId ? job.paymentId : "N/A (Cupón o Pendiente)"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase border-2 ${
                          job.status === "active"
                            ? "bg-green-100 text-green-800 border-green-800"
                            : "bg-yellow-100 text-yellow-800 border-yellow-800"
                        }`}
                      >
                        {job.status === "active" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-800" /> Aprobado / Activo
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-yellow-800" /> Pendiente
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {job.status === "pending" && (
                        <button
                          onClick={() => handleForceApprove(job._id)}
                          disabled={actionLoading === job._id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/80 text-white text-xs font-black uppercase tracking-wider transition-transform hover:translate-y-[-2px] border-2 border-transparent"
                        >
                          <Zap className="w-4 h-4" />
                          <span>Activar Manualmente</span>
                        </button>
                      )}
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
