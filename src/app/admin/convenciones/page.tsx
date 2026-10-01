"use client";

import { useEffect, useState } from "react";
import { Search, CheckCircle2, Clock, Trash2, ExternalLink, RefreshCw, AlertCircle, Edit } from "lucide-react";
import Link from "next/link";

interface Convention {
  _id: string;
  title: string;
  city: string;
  province: string;
  startDate: string;
  endDate: string;
  publicationStatus: "pending" | "published";
  eventStatus: "scheduled" | "postponed" | "cancelled";
  slug: string;
  createdAt: string;
}

export default function AdminConvencionesPage() {
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "pending">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchConventions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/conventions");
      if (res.ok) {
        const data = await res.json();
        setConventions(data);
      }
    } catch (error) {
      console.error("Error fetching conventions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConventions();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (actionLoading) return;
    const newStatus = currentStatus === "published" ? "pending" : "published";
    
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/conventions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, publicationStatus: newStatus }),
      });

      if (res.ok) {
        setConventions(prev => prev.map(conv => 
          conv._id === id ? { ...conv, publicationStatus: newStatus } : conv
        ));
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConvention = async (id: string) => {
    if (actionLoading) return;
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta convención permanentemente? Esta acción no se puede deshacer.")) {
      return;
    }

    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/conventions?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setConventions(prev => prev.filter(conv => conv._id !== id));
      }
    } catch (error) {
      console.error("Error deleting convention:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredConventions = conventions.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(search.toLowerCase()) || 
                          conv.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || conv.publicationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-serif" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
            Moderación de Convenciones
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1">
            Gestiona, aprueba y elimina convenciones publicadas por organizadores.
          </p>
        </div>
        <button
          onClick={fetchConventions}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-bold uppercase text-xs tracking-wider border-2 border-black hover:bg-transparent hover:text-black transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refrescar
        </button>
      </div>

      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="BUSCAR POR NOMBRE O CIUDAD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-black focus:outline-none focus:ring-0 focus:border-black font-bold text-sm uppercase placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="border-2 border-black px-4 py-3 bg-white font-bold text-sm uppercase focus:outline-none min-w-[200px] cursor-pointer"
        >
          <option value="all">Todos los Estados</option>
          <option value="published">Publicados (Visibles)</option>
          <option value="pending">Pendientes (Ocultos)</option>
        </select>
      </div>

      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1 overflow-hidden">
        {loading && conventions.length === 0 ? (
          <div className="py-12 text-center">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-black mb-4" />
            <p className="font-bold uppercase tracking-widest text-muted-foreground">Cargando convenciones...</p>
          </div>
        ) : filteredConventions.length === 0 ? (
          <div className="py-16 text-center px-4">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="font-black uppercase tracking-widest text-xl mb-2">No se encontraron convenciones</p>
            <p className="font-bold uppercase text-sm text-muted-foreground">Prueba ajustar los filtros de búsqueda.</p>
          </div>
        ) : (
          <>
            {/* Vista Mobile (Tarjetas) */}
            <div className="block xl:hidden mt-4 space-y-4">
            {filteredConventions.map((conv) => (
              <div key={conv._id} className="bg-gray-50 border-2 border-black p-4 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-2 mb-2">
                <div>
                  <div className="font-black uppercase text-lg">{conv.title}</div>
                  <div className="text-xs font-bold text-muted-foreground mt-0.5 uppercase">{conv.city}, {conv.province}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Fechas:</span>
                    <div className="font-bold uppercase text-black">
                      {new Date(conv.startDate).toLocaleDateString('es-AR')} - {new Date(conv.endDate).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Status:</span>
                    <div className="font-bold uppercase text-black">
                      {conv.eventStatus === 'scheduled' ? 'Confirmado' : conv.eventStatus === 'postponed' ? 'Pospuesto' : 'Cancelado'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-black">
                  <button
                    onClick={() => handleToggleStatus(conv._id, conv.publicationStatus)}
                    disabled={actionLoading === conv._id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase border-2 transition-transform hover:translate-y-[-1px] ${
                      conv.publicationStatus === "published"
                        ? "bg-green-100 text-green-800 border-green-800"
                        : "bg-yellow-100 text-yellow-800 border-yellow-800"
                    }`}
                  >
                    {conv.publicationStatus === "published" ? (
                      <><CheckCircle2 className="w-3 h-3 text-green-800" /> Publicado</>
                    ) : (
                      <><Clock className="w-3 h-3 text-yellow-800" /> Pendiente</>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/convenciones/${conv.slug}`}
                      target="_blank"
                      className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link href={`/convenciones/${conv.slug}/editar`} className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"><Edit className="w-4 h-4" /></Link>
                    <button
                      onClick={() => handleDeleteConvention(conv._id)}
                      disabled={actionLoading === conv._id}
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
          <div className="hidden xl:block overflow-x-auto m-1">
            <table className="w-full text-left text-sm text-black min-w-[800px]">
              <thead className="bg-gray-50 text-xs font-black uppercase text-black border-b-2 border-black">
                <tr>
                  <th className="px-6 py-4">Convención & Ubicación</th>
                  <th className="px-6 py-4">Fechas</th>
                  <th className="px-6 py-4">Moderación</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {filteredConventions.map((conv) => (
                  <tr key={conv._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-black uppercase truncate max-w-[300px]">{conv.title}</div>
                      <div className="text-xs font-bold text-muted-foreground mt-0.5 uppercase">{conv.city}, {conv.province}</div>
                      {conv.eventStatus !== 'scheduled' && (
                        <div className="text-xs font-bold text-red-600 mt-0.5 uppercase">
                          ({conv.eventStatus})
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold uppercase text-black">
                        {new Date(conv.startDate).toLocaleDateString('es-AR')}
                      </div>
                      <div className="text-xs font-bold text-muted-foreground uppercase">
                        al {new Date(conv.endDate).toLocaleDateString('es-AR')}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(conv._id, conv.publicationStatus)}
                        disabled={actionLoading === conv._id}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase border-2 transition-transform hover:translate-y-[-1px] ${
                          conv.publicationStatus === "published"
                            ? "bg-green-100 text-green-800 border-green-800"
                            : "bg-yellow-100 text-yellow-800 border-yellow-800"
                        }`}
                        title="Haz clic para alternar el estado"
                      >
                        {conv.publicationStatus === "published" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-800" /> Publicado
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
                        href={`/convenciones/${conv.slug}`}
                        target="_blank"
                        className="inline-flex items-center justify-center p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"
                        title="Ver en el sitio web"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                      <Link href={`/convenciones/${conv.slug}/editar`} className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all" title="Editar"><Edit className="w-5 h-5" /></Link>

                      <button
                        onClick={() => handleDeleteConvention(conv._id)}
                        disabled={actionLoading === conv._id}
                        className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"
                        title="Eliminar convención"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
