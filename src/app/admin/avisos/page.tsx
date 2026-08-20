"use client";

import { useEffect, useState } from "react";
import { Search, CheckCircle2, Clock, Trash2, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  studioName: string;
  location: string;
  category: string;
  status: "active" | "pending";
  couponCode?: string;
  paymentId?: string;
  createdAt: string;
}

export default function AdminAvisosPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "pending">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("Error al cargar avisos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    setActionLoading(jobId);
    const newStatus = currentStatus === "active" ? "pending" : "active";
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId, status: newStatus }),
      });

      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, status: newStatus as any } : j))
        );
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este aviso de producción?")) return;
    setActionLoading(jobId);
    try {
      const res = await fetch(`/api/admin/jobs?id=${jobId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      console.error("Error al eliminar aviso:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.studioName.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "active") return matchesSearch && job.status === "active";
    if (filterStatus === "pending") return matchesSearch && job.status === "pending";
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Moderación de Avisos</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Revisá, aprobá, cambiá el estado o eliminá publicaciones de la plataforma en tiempo real.
          </p>
        </div>
        <button
          onClick={fetchJobs}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por título, estudio o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Todos ({jobs.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === "active"
                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                : "text-zinc-400 hover:text-emerald-400"
            }`}
          >
            Activos ({jobs.filter((j) => j.status === "active").length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === "pending"
                ? "bg-amber-950 text-amber-300 border border-amber-800"
                : "text-zinc-400 hover:text-amber-400"
            }`}
          >
            Pendientes ({jobs.filter((j) => j.status === "pending").length})
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-sm">Cargando avisos...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-zinc-600" />
            <p>No se encontraron avisos que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Aviso & Estudio</th>
                  <th className="px-6 py-4">Categoría / Ubicación</th>
                  <th className="px-6 py-4">Cupón / Pago</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-zinc-950/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white truncate max-w-xs">{job.title}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">{job.studioName}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-zinc-200">{job.category}</div>
                      <div className="text-xs text-zinc-500">{job.location}</div>
                    </td>

                    <td className="px-6 py-4">
                      {job.couponCode ? (
                        <span className="inline-block px-2 py-0.5 text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800/60 rounded">
                          {job.couponCode}
                        </span>
                      ) : job.paymentId ? (
                        <span className="text-xs text-zinc-400 font-mono">ID: {job.paymentId.slice(0, 10)}...</span>
                      ) : (
                        <span className="text-xs text-zinc-600">Sin cupón</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(job._id, job.status)}
                        disabled={actionLoading === job._id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          job.status === "active"
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-amber-950 hover:text-amber-300 hover:border-amber-800"
                            : "bg-amber-950/80 text-amber-300 border-amber-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-800"
                        }`}
                        title="Haz clic para alternar el estado"
                      >
                        {job.status === "active" ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Activo
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-400" /> Pendiente
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/empleos/${job._id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 p-2 text-zinc-400 hover:text-sky-400 transition-colors"
                        title="Ver en el sitio web"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        disabled={actionLoading === job._id}
                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Eliminar aviso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
