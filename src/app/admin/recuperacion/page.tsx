"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Mail, CheckCircle2, Trash2, ExternalLink, RefreshCw, Calendar, MapPin, Building2 } from "lucide-react";
import Link from "next/link";

interface AbandonedJob {
  _id: string;
  title: string;
  studioName: string;
  location: string;
  category: string;
  status: "pending";
  createdAt: string;
  studioInfo?: {
    nombre: string;
    instagram: string;
    whatsapp: string;
  };
}

export default function AdminRecuperacionPage() {
  const [jobs, setJobs] = useState<AbandonedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAbandoned = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/abandoned");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("Error al obtener checkouts abandonados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbandoned();
  }, []);

  const handleForceActivate = async (jobId: string) => {
    if (!confirm("¿Deseas activar esta publicación manualmente y bonificar su costo?")) return;
    setActionLoading(jobId);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId, status: "active" }),
      });

      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      console.error("Error al activar publicación:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDraft = async (jobId: string) => {
    if (!confirm("¿Eliminar este borrador abandonado?")) return;
    setActionLoading(jobId);
    try {
      const res = await fetch(`/api/admin/jobs?id=${jobId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      console.error("Error al eliminar borrador:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Recuperación de Checkouts Abandonados</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Seguimiento de estudios que crearon un aviso pero no completaron la pasarela de pago o aplicación de cupón.
          </p>
        </div>
        <button
          onClick={fetchAbandoned}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {/* Main List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Borradores Pendientes ({jobs.length})
            </span>
          </div>
          <span className="text-xs text-zinc-500">Listos para acción o asistencia</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-sm">Buscando publicaciones abandonadas...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm">
            🎉 ¡Excelente! No hay publicaciones abandonadas en este momento.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-zinc-950/40 transition-colors"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800/60 rounded-full">
                      Pendiente de Pago
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(job.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white truncate">{job.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-sky-400" /> {job.studioName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {job.location}
                    </span>
                    <span className="text-zinc-500">{job.category}</span>
                  </div>

                  {job.studioInfo && (
                    <div className="text-xs text-zinc-500 pt-1 flex items-center gap-3">
                      {job.studioInfo.whatsapp && (
                        <a
                          href={`https://wa.me/${job.studioInfo.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          💬 Contactar Estudio por WhatsApp ({job.studioInfo.whatsapp})
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleForceActivate(job._id)}
                    disabled={actionLoading === job._id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aprobar & Activar</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDraft(job._id)}
                    disabled={actionLoading === job._id}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Descartar borrador abandonado"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
