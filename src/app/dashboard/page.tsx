"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { SpecialtyPill } from "@/components/ui/SpecialtyPill";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Calendar, MapPin, Eye, Pencil, ExternalLink } from "lucide-react";
import Link from "next/link";

interface JobListing {
  _id: string;
  title: string;
  studioName: string;
  location: string;
  category: string;
  status: "pending" | "active";
  createdAt: string;
}

interface ConventionListing {
  _id: string;
  title: string;
  city: string;
  province: string;
  startDate: string;
  publicationStatus: "pending" | "published";
  eventStatus: "scheduled" | "postponed" | "cancelled";
  createdAt: string;
}

interface StudioData {
  _id: string;
  nombre: string;
  anio: string;
  ubicacion: string;
  bio: string;
  instagram: string;
  especialidades: string[];
  fotos: string[];
  portada?: string;
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'convenciones' ? 'convenciones' : 'empleos';

  const [activeTab, setActiveTab] = useState<'empleos' | 'convenciones'>(defaultTab);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [conventions, setConventions] = useState<ConventionListing[]>([]);
  const [studio, setStudio] = useState<StudioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchData() {
      try {
        const [jobsRes, studioRes, convRes] = await Promise.all([
          fetch("/api/my-jobs"),
          fetch("/api/studio"),
          fetch("/api/my-conventions"),
        ]);

        if (jobsRes.ok) setJobs(await jobsRes.json());
        if (studioRes.ok) {
          const data = await studioRes.json();
          if (data) setStudio(data);
        }
        if (convRes.ok) setConventions(await convRes.json());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [status]);

  const activeJobs = jobs.filter((j) => j.status === "active");
  const pendingJobs = jobs.filter((j) => j.status === "pending");

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isWithin30Days = (dateStr: string) => {
    const jobDate = new Date(dateStr);
    const diffTime = new Date().getTime() - jobDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        await fetch("/api/studio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ portada: url }),
        });
        setStudio((prev) => (prev ? { ...prev, portada: url } : prev));
      }
    } catch (error) {
      console.error("Cover upload error:", error);
    } finally {
      setUploadingCover(false);
    }
  };

  const coverImage = studio?.portada || studio?.fotos?.[0] || null;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-body text-muted-foreground">Cargando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row border-t border-border">
        <DashboardSidebar studioName={studio?.nombre} />

        {/* Main Content */}
        <section className="flex-1 p-8 md:p-12 lg:p-16 min-w-0">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-border pb-4">
            <h1 className="text-display-xl">Publicaciones</h1>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('empleos')}
                className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'empleos' ? 'border-black text-black' : 'border-transparent text-muted-foreground hover:text-black'}`}
              >
                Empleos
              </button>
              <button 
                onClick={() => setActiveTab('convenciones')}
                className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'convenciones' ? 'border-black text-black' : 'border-transparent text-muted-foreground hover:text-black'}`}
              >
                Convenciones
              </button>
            </div>
          </div>

          {activeTab === 'empleos' && (
            <>
              {jobs.length === 0 ? (
                <div className="bg-white border border-border p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-8">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-h3 mb-4">Sin publicaciones de empleo</h3>
                  <p className="text-body-sm text-muted-foreground mb-8 max-w-sm">
                    Todavía no publicaste ningún aviso. Creá tu primera búsqueda laboral y empezá a recibir postulantes.
                  </p>
                  <Link href="/publicar-empleo" className="bg-black text-white px-10 py-4 text-button hover:bg-black/90 transition-colors">
                    Publicar Aviso
                  </Link>
                </div>
              ) : (
                <div className="bg-white border border-border">
                  {/* Active Jobs */}
                  {activeJobs.length > 0 && (
                    <>
                      <div className="px-8 py-4 border-b border-border bg-gray-50">
                        <span className="text-label-sm text-muted-foreground uppercase tracking-wider">Activas ({activeJobs.length})</span>
                      </div>
                      {activeJobs.map((job) => (
                        <div key={job._id} className="px-8 py-8 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="bg-black text-white px-2 py-0.5 text-caption-sm">Activo</span>
                              <span className="text-label-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {formatDate(job.createdAt)}
                              </span>
                            </div>
                            <h3 className="text-h3 mb-2 truncate">{job.title} — {job.studioName}</h3>
                            <div className="flex items-center gap-4 text-label-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                              <span>{job.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            {isWithin30Days(job.createdAt) && (
                              <Link href={`/dashboard/editar-empleo/${job._id}`} className="text-label-sm text-black hover:text-black/70 transition-colors flex items-center gap-1 border border-border px-4 py-2 hover:bg-gray-50">
                                <Pencil className="w-3 h-3" /> Editar
                              </Link>
                            )}
                            <Link href={`/empleos/${job._id}`} className="text-label-sm text-muted-foreground hover:text-black transition-colors flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Ver
                            </Link>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Pending Jobs */}
                  {pendingJobs.length > 0 && (
                    <>
                      <div className="px-8 py-4 border-b border-border bg-gray-50">
                        <span className="text-label-sm text-muted-foreground uppercase tracking-wider">Pendientes de Pago ({pendingJobs.length})</span>
                      </div>
                      {pendingJobs.map((job) => (
                        <div key={job._id} className="px-8 py-8 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-60">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="border border-border text-muted-foreground bg-gray-50 px-2 py-0.5 text-caption-sm">Pendiente</span>
                              <span className="text-label-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {formatDate(job.createdAt)}
                              </span>
                            </div>
                            <h3 className="text-h3 mb-2 truncate text-muted-foreground">{job.title} — {job.studioName}</h3>
                            <div className="flex items-center gap-4 text-label-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                            </div>
                          </div>
                          <Link href={`/checkout/${job._id}`} className="text-label-sm hover:underline transition-colors">
                            Completar Pago →
                          </Link>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'convenciones' && (
            <>
              {conventions.length === 0 ? (
                <div className="bg-white border border-border p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-8">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-h3 mb-4">Sin convenciones</h3>
                  <p className="text-body-sm text-muted-foreground mb-8 max-w-sm">
                    Todavía no publicaste ninguna convención. Creá tu primer evento en la cartelera.
                  </p>
                  <Link href="/convenciones/nueva" className="bg-black text-white px-10 py-4 text-button hover:bg-black/90 transition-colors">
                    Publicar Evento
                  </Link>
                </div>
              ) : (
                <div className="bg-white border border-border">
                  <div className="px-8 py-4 border-b border-border bg-gray-50 flex justify-between items-center">
                    <span className="text-label-sm text-muted-foreground uppercase tracking-wider">Mis Eventos ({conventions.length})</span>
                    <Link href="/convenciones/nueva" className="text-label-sm text-black hover:underline font-medium flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Nuevo
                    </Link>
                  </div>
                  
                  {conventions.map((conv) => (
                    <div key={conv._id} className="px-8 py-8 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          {conv.publicationStatus === 'pending' ? (
                            <span className="border border-yellow-300 text-yellow-700 bg-yellow-50 px-2 py-0.5 text-caption-sm">En revisión</span>
                          ) : (
                            <span className="bg-black text-white px-2 py-0.5 text-caption-sm">Publicado</span>
                          )}

                          {conv.eventStatus === 'postponed' && (
                            <span className="border border-orange-300 text-orange-700 bg-orange-50 px-2 py-0.5 text-caption-sm">Pospuesto</span>
                          )}
                          {conv.eventStatus === 'cancelled' && (
                            <span className="border border-red-300 text-red-700 bg-red-50 px-2 py-0.5 text-caption-sm">Cancelado</span>
                          )}
                          
                          <span className="text-label-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(conv.startDate)}
                          </span>
                        </div>
                        <h3 className="text-h3 mb-2 truncate">{conv.title}</h3>
                        <div className="flex items-center gap-4 text-label-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {conv.city}, {conv.province}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <Link href={`/convenciones/${conv._id}/editar`} className="text-label-sm text-black hover:text-black/70 transition-colors flex items-center gap-1 border border-border px-4 py-2 hover:bg-gray-50">
                          <Pencil className="w-3 h-3" /> Editar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Right Panel: Studio Preview */}
        {studio && (
          <aside className="w-full lg:w-80 border-l border-border bg-white flex-shrink-0">
            <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden group">
              {coverImage ? (
                <Image src={coverImage} alt="Portada del estudio" fill sizes="320px" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-label-sm text-muted-foreground">Sin portada</span>
                </div>
              )}
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="absolute bottom-3 right-3 w-9 h-9 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
              >
                {uploadingCover ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Pencil className="w-4 h-4" />}
              </button>
              <input ref={coverInputRef} type="file" accept="image/*" className="sr-only" onChange={handleCoverUpload} />
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-h3 mb-1">{studio.nombre}</h3>
                <p className="text-label-sm text-muted-foreground">Est. {studio.anio} · {studio.ubicacion}</p>
              </div>
              {studio.bio && <p className="text-body-sm text-foreground/80 leading-relaxed line-clamp-4">{studio.bio}</p>}
              {studio.especialidades?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {studio.especialidades.map((spec) => <SpecialtyPill key={spec} label={spec} variant="default" />)}
                </div>
              )}
              <div className="pt-4 border-t border-border/50">
                <Link href={`/estudios/${studio._id}`} className="flex items-center justify-center gap-2 w-full border border-black py-3 text-button hover:bg-black hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" /> Ver Perfil Público
                </Link>
              </div>
            </div>
          </aside>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-body text-muted-foreground">Cargando...</p>
        </main>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
