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
          <h1 className="text-display-sm font-black uppercase tracking-tight">Recuperación de Checkouts Abandonados</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mt-1">
            Seguimiento de estudios que crearon un aviso pero no completaron la pasarela de pago o aplicación de cupón.
          </p>
        </div>
        <button
          onClick={fetchAbandoned}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {/* Main List */}
      <div className="bg-white border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-6 bg-gray-50 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-black" />
            <span className="text-sm font-black uppercase tracking-wider text-black">
              Borradores Pendientes ({jobs.length})
            </span>
          </div>
          <span className="text-xs font-bold uppercase text-muted-foreground">Listos para acción o asistencia</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-black font-bold uppercase text-sm">Buscando publicaciones abandonadas...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-black font-bold uppercase text-sm">
            🎉 ¡Excelente! No hay publicaciones abandonadas en este momento.
          </div>
        ) : (
          <div className="divide-y-2 divide-gray-200">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-4 min-w-0 flex-1">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 text-xs font-black uppercase bg-yellow-100 text-yellow-900 border-2 border-yellow-900">
                      Pendiente de Pago
                    </span>
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {formatDate(job.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-xl font-black uppercase truncate max-w-[400px]">{job.title}</h3>

                  <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase text-black">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-black" /> {job.studioName}
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                    <span className="text-muted-foreground">{job.category}</span>
                  </div>

                  {job.studioInfo && (
                    <div className="text-xs font-bold uppercase text-muted-foreground pt-2 flex items-center gap-3">
                      {job.studioInfo.whatsapp && (
                        <a
                          href={`https://wa.me/${job.studioInfo.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-700 hover:underline flex items-center gap-2"
                        >
                          💬 Contactar Estudio por WhatsApp ({job.studioInfo.whatsapp})
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
                  <button
                    onClick={() => handleForceActivate(job._id)}
                    disabled={actionLoading === job._id}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-900 border-2 border-green-900 rounded-none text-xs font-black uppercase transition-transform hover:translate-y-[-2px]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprobar & Activar</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDraft(job._id)}
                    disabled={actionLoading === job._id}
                    className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-colors"
                    title="Descartar borrador abandonado"
                  >
                    <Trash2 className="w-5 h-5" />
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
