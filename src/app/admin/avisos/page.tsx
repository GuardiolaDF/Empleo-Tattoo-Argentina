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
          <h1 className="text-display-sm font-black uppercase tracking-tight">Moderación de Avisos</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mt-1">
            Revisá, aprobá, cambiá el estado o eliminá publicaciones de la plataforma en tiempo real.
          </p>
        </div>
        <button
          onClick={fetchJobs}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-6 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Buscar por título, estudio o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border-2 border-black pl-10 pr-4 py-3 text-sm font-bold text-black placeholder-gray-500 focus:outline-none focus:bg-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider transition-colors border-2 ${
              filterStatus === "all"
                ? "bg-black text-white border-black"
                : "bg-gray-50 text-black border-transparent hover:border-black"
            }`}
          >
            Todos ({jobs.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider transition-colors border-2 ${
              filterStatus === "active"
                ? "bg-green-100 text-green-800 border-green-800"
                : "bg-gray-50 text-black border-transparent hover:border-black"
            }`}
          >
            Activos ({jobs.filter((j) => j.status === "active").length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider transition-colors border-2 ${
              filterStatus === "pending"
                ? "bg-yellow-100 text-yellow-800 border-yellow-800"
                : "bg-gray-50 text-black border-transparent hover:border-black"
            }`}
          >
            Pendientes ({jobs.filter((j) => j.status === "pending").length})
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {loading ? (
          <div className="p-12 text-center text-black text-sm font-bold uppercase">Cargando avisos...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center text-black text-sm font-bold uppercase flex flex-col items-center gap-4">
            <AlertCircle className="w-10 h-10 text-black" />
            <p>No se encontraron avisos que coincidan con la búsqueda.</p>
          </div>
        ) : (
          {/* Vista Mobile (Tarjetas) */}
          <div className="block xl:hidden mt-4 space-y-4">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-gray-50 border-2 border-black p-4 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <div className="font-black uppercase">{job.title}</div>
                  <div className="text-xs font-bold text-muted-foreground mt-0.5 uppercase">{job.studioName}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Categoría:</span>
                    <div className="font-bold uppercase text-black">{job.category}</div>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Ubicación:</span>
                    <div className="font-bold uppercase text-black">{job.location}</div>
                  </div>
                </div>

                <div>
                  {job.couponCode ? (
                    <span className="inline-block px-3 py-1 text-[10px] font-black uppercase bg-purple-100 text-purple-800 border-2 border-purple-800">
                      Cupón: {job.couponCode}
                    </span>
                  ) : job.paymentId ? (
                    <span className="text-[10px] text-black font-bold uppercase">Pago ID: {job.paymentId.slice(0, 10)}...</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Sin cupón/pago</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-black">
                  <button
                    onClick={() => handleToggleStatus(job._id, job.status)}
                    disabled={actionLoading === job._id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase border-2 transition-transform hover:translate-y-[-1px] ${
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
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/empleos/${job._id}`}
                      target="_blank"
                      className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      disabled={actionLoading === job._id}
                      className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                  <th className="px-6 py-4">Categoría / Ubicación</th>
                  <th className="px-6 py-4">Cupón / Pago</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-black uppercase truncate max-w-[200px]">{job.title}</div>
                      <div className="text-xs font-bold text-muted-foreground mt-0.5 uppercase">{job.studioName}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold uppercase text-black">{job.category}</div>
                      <div className="text-xs font-bold text-muted-foreground uppercase">{job.location}</div>
                    </td>

                    <td className="px-6 py-4">
                      {job.couponCode ? (
                        <span className="inline-block px-3 py-1 text-xs font-black uppercase bg-purple-100 text-purple-800 border-2 border-purple-800">
                          {job.couponCode}
                        </span>
                      ) : job.paymentId ? (
                        <span className="text-xs text-black font-bold uppercase">ID: {job.paymentId.slice(0, 10)}...</span>
                      ) : (
                        <span className="text-xs text-muted-foreground font-bold uppercase">Sin cupón</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(job._id, job.status)}
                        disabled={actionLoading === job._id}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase border-2 transition-transform hover:translate-y-[-1px] ${
                          job.status === "active"
                            ? "bg-green-100 text-green-800 border-green-800"
                            : "bg-yellow-100 text-yellow-800 border-yellow-800"
                        }`}
                        title="Haz clic para alternar el estado"
                      >
                        {job.status === "active" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-800" /> Activo
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-yellow-800" /> Pendiente
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/empleos/${job._id}`}
                        target="_blank"
                        className="inline-flex items-center justify-center p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"
                        title="Ver en el sitio web"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        disabled={actionLoading === job._id}
                        className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"
                        title="Eliminar aviso"
                      >
                        <Trash2 className="w-5 h-5" />
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
