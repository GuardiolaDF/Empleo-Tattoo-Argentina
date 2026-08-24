"use client";

import { useEffect, useState } from "react";
import { Building2, Search, ExternalLink, MapPin, AtSign, MessageSquare, Briefcase, RefreshCw, PowerOff, Trash2 } from "lucide-react";
import Link from "next/link";

interface Studio {
  _id: string;
  userId: string;
  nombre: string;
  anio: string;
  ubicacion: string;
  bio: string;
  instagram: string;
  whatsapp: string;
  especialidades: string[];
  fotos: string[];
  status?: string;
  jobCount: number;
  createdAt: string;
}

export default function AdminEstudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStudios = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/studios");
      if (res.ok) {
        const data = await res.json();
        setStudios(data);
      }
    } catch (err) {
      console.error("Error al cargar estudios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (id: string, currentStatus: string) => {
    if (!confirm(`¿Estás seguro de ${currentStatus === 'suspended' ? 'reactivar' : 'suspender'} este estudio?`)) return;
    try {
      const res = await fetch(`/api/admin/studios/${id}/suspend`, { method: "PATCH" });
      if (res.ok) {
        fetchStudios();
      } else {
        alert("Error al cambiar estado");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿ESTÁS SEGURO? Esta acción eliminará el estudio y todos sus avisos permanentemente. No se puede deshacer.")) return;
    try {
      const res = await fetch(`/api/admin/studios/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchStudios();
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const filteredStudios = studios.filter(
    (s) =>
      s.nombre.toLowerCase().includes(search.toLowerCase()) ||
      s.ubicacion.toLowerCase().includes(search.toLowerCase()) ||
      s.instagram.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-black uppercase tracking-tight">Estudios Registrados</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mt-1">
            Supervisión de perfiles de estudios, ubicaciones y volumen de publicaciones activas.
          </p>
        </div>
        <button
          onClick={fetchStudios}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-6 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Buscar por nombre de estudio, ubicación o usuario Instagram..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border-2 border-black pl-10 pr-4 py-3 text-sm font-bold text-black placeholder-gray-500 focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Studios Table */}
      <div className="bg-white border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {loading ? (
          <div className="p-12 text-center text-black font-bold uppercase text-sm">Cargando estudios...</div>
        ) : filteredStudios.length === 0 ? (
          <div className="p-12 text-center text-black font-bold uppercase text-sm">No se encontraron estudios registrados.</div>
        ) : (
          <>
            {/* Vista Mobile (Tarjetas) */}
            <div className="block xl:hidden mt-4 space-y-4">
            {filteredStudios.map((studio) => (
              <div key={studio._id} className="bg-gray-50 border-2 border-black p-4 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-none bg-black text-white border-2 border-black flex items-center justify-center font-black text-lg uppercase shadow-sm">
                    {studio.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-black uppercase">{studio.nombre}</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase mt-1">ID: {studio.userId.slice(0, 10)}...</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Ubicación:</span>
                    <div className="font-bold uppercase text-black flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {studio.ubicacion}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Fundación:</span>
                    <div className="font-bold uppercase text-black">Est. {studio.anio}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {studio.instagram && (
                    <a href={`https://instagram.com/${studio.instagram.replace("@", "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-pink-600 border border-pink-600 px-2 py-1 bg-pink-50">
                      <AtSign className="w-3 h-3" /> @{studio.instagram.replace("@", "")}
                    </a>
                  )}
                  {studio.whatsapp && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-green-700 border border-green-700 px-2 py-1 bg-green-50">
                      <MessageSquare className="w-3 h-3" /> {studio.whatsapp}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase bg-gray-200 text-black border-2 border-black">
                    <Briefcase className="w-3 h-3" /> {studio.jobCount} avisos
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-black">
                  <button
                    onClick={() => handleSuspend(studio._id, studio.status || 'active')}
                    className={`px-3 py-1.5 transition-colors border-2 text-[10px] font-black uppercase flex items-center gap-1 ${
                      studio.status === 'suspended'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-800'
                        : 'text-black border-black bg-white'
                    }`}
                  >
                    <PowerOff className="w-3 h-3" /> {studio.status === 'suspended' ? 'Reactivar' : 'Suspender'}
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/estudios/${studio._id}`}
                      target="_blank"
                      className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(studio._id)}
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
              <thead className="bg-gray-50 text-xs uppercase font-black text-black border-b-2 border-black">
                <tr>
                  <th className="px-6 py-4">Estudio</th>
                  <th className="px-6 py-4">Ubicación & Año</th>
                  <th className="px-6 py-4">Contactos Directos</th>
                  <th className="px-6 py-4">Avisos Creados</th>
                  <th className="px-6 py-4 text-right">Ver Perfil</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {filteredStudios.map((studio) => (
                  <tr key={studio._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-none bg-black text-white border-2 border-black flex items-center justify-center font-black text-lg uppercase shadow-sm">
                          {studio.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black uppercase truncate max-w-[200px]">{studio.nombre}</div>
                          <div className="text-xs text-muted-foreground font-bold uppercase mt-1">ID: {studio.userId.slice(0, 10)}...</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold uppercase flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-black" />
                        {studio.ubicacion}
                      </div>
                      <div className="text-xs text-muted-foreground font-bold uppercase mt-1">Est. {studio.anio}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {studio.instagram && (
                          <a
                            href={`https://instagram.com/${studio.instagram.replace("@", "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold uppercase text-pink-600 hover:underline"
                          >
                            <AtSign className="w-4 h-4" /> @{studio.instagram.replace("@", "")}
                          </a>
                        )}
                        {studio.whatsapp && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-green-700">
                            <MessageSquare className="w-4 h-4" /> {studio.whatsapp}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-none text-xs font-black uppercase bg-gray-100 text-black border-2 border-black">
                        <Briefcase className="w-4 h-4" />
                        {studio.jobCount} avisos
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSuspend(studio._id, studio.status || 'active')}
                          className={`p-3 transition-colors border-2 ${
                            studio.status === 'suspended'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-800 hover:bg-yellow-200'
                              : 'text-black border-transparent hover:border-black hover:bg-white'
                          }`}
                          title={studio.status === 'suspended' ? 'Reactivar estudio' : 'Suspender estudio'}
                        >
                          <PowerOff className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(studio._id)}
                          className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-colors"
                          title="Eliminar estudio permanentemente"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <Link
                          href={`/estudios/${studio._id}`}
                          target="_blank"
                          className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-colors"
                          title="Ver perfil público del estudio"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                      </div>
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
