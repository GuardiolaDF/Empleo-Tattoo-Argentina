"use client";

import { useEffect, useState } from "react";
import { Building2, Search, ExternalLink, MapPin, Instagram, MessageSquare, Briefcase, RefreshCw } from "lucide-react";
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Estudios Registrados</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Supervisión de perfiles de estudios, ubicaciones y volumen de publicaciones activas.
          </p>
        </div>
        <button
          onClick={fetchStudios}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nombre de estudio, ubicación o usuario Instagram..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Studios Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-sm">Cargando estudios...</div>
        ) : filteredStudios.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm">No se encontraron estudios registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Estudio</th>
                  <th className="px-6 py-4">Ubicación & Año</th>
                  <th className="px-6 py-4">Contactos Directos</th>
                  <th className="px-6 py-4">Avisos Creados</th>
                  <th className="px-6 py-4 text-right">Ver Perfil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredStudios.map((studio) => (
                  <tr key={studio._id} className="hover:bg-zinc-950/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/60 flex items-center justify-center font-bold text-sm">
                          {studio.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{studio.nombre}</div>
                          <div className="text-xs text-zinc-500 font-mono">ID: {studio.userId.slice(0, 10)}...</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-zinc-200 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {studio.ubicacion}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">Est. {studio.anio}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {studio.instagram && (
                          <a
                            href={`https://instagram.com/${studio.instagram.replace("@", "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-pink-400 hover:underline"
                          >
                            <Instagram className="w-3.5 h-3.5" /> @{studio.instagram.replace("@", "")}
                          </a>
                        )}
                        {studio.whatsapp && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <MessageSquare className="w-3.5 h-3.5" /> {studio.whatsapp}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-950 text-zinc-300 border border-zinc-800">
                        <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                        {studio.jobCount} avisos
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/estudios/${studio._id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 p-2 text-zinc-400 hover:text-sky-400 transition-colors"
                        title="Ver perfil público del estudio"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
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
