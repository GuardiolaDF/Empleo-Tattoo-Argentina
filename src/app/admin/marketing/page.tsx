"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Download, Copy, Trash2, EyeOff, Share2 } from "lucide-react";
import { InstagramStoryTemplate } from "@/components/admin/InstagramStoryTemplate";
import Script from "next/script";

export default function MarketingPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'shared'>('pending');
  const templateRef = useRef<HTMLDivElement>(null);
  const [renderingJobId, setRenderingJobId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Reusing the finance endpoint or jobs endpoint? 
      // Actually, we don't have an endpoint that exposes all jobs with studio info easily for marketing.
      // We should create a GET api/admin/jobs/marketing or just fetch from /api/jobs and filter.
      // Let's create an API call to a new endpoint we will build: /api/admin/jobs/marketing
      const res = await fetch("/api/admin/jobs/marketing");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingJobs = jobs.filter(j => !j.sharedOnInstagram);
  const sharedJobs = jobs.filter(j => j.sharedOnInstagram);
  const displayedJobs = activeTab === 'pending' ? pendingJobs : sharedJobs;

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/jobs/${id}/instagram`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sharedOnInstagram: !currentStatus }),
      });
      if (res.ok) {
        setJobs(jobs.map(j => j._id === id ? { ...j, sharedOnInstagram: !currentStatus } : j));
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/empleos/${id}`;
    navigator.clipboard.writeText(url);
    alert("Enlace copiado al portapapeles: " + url);
  };

  const generateAndDownloadStory = async (job: any, mode: 'download' | 'share' = 'download') => {
    setRenderingJobId(job._id);
    
    // Allow React to render the template in the background
    await new Promise(r => setTimeout(r, 100));

    try {
      if (typeof window === 'undefined' || !(window as any).html2canvas) {
        alert("La librería del motor gráfico aún está cargando. Intenta de nuevo en 2 segundos.");
        return;
      }
      
      const element = templateRef.current;
      if (!element) return;

      const canvas = await (window as any).html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: "#C0C0C0",
      });

      const dataUrl = canvas.toDataURL("image/png");

      if (mode === 'share' && navigator.share) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], `historia-${job.studioName.replace(/\\s+/g, '-')}.png`, { type: 'image/png' });
          await navigator.share({
            title: 'Nueva Publicación ETA',
            text: `Publicación de ${job.studioName}`,
            files: [file],
          });
          // Si se compartió con éxito, podríamos marcarlo automáticamente
          // toggleStatus(job._id, job.sharedOnInstagram);
        } catch (shareError) {
          console.error("Error al compartir:", shareError);
          // Fallback to download
          downloadImage(dataUrl, job);
        }
      } else {
        downloadImage(dataUrl, job);
      }
    } catch (err) {
      console.error("Error generando imagen:", err);
      alert("Hubo un error al generar la gráfica.");
    } finally {
      setRenderingJobId(null);
    }
  };

  const downloadImage = (dataUrl: string, job: any) => {
    const link = document.createElement('a');
    link.download = `historia-${job.studioName.replace(/\\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="p-8">
      {/* Cargar html2canvas por CDN */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="lazyOnload" />

      <h1 className="text-h2 font-black uppercase mb-8">Marketing: Historias de Instagram</h1>

      <div className="flex space-x-4 mb-8">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-bold uppercase transition-colors ${activeTab === 'pending' ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
        >
          Pendientes ({pendingJobs.length})
        </button>
        <button 
          onClick={() => setActiveTab('shared')}
          className={`px-6 py-3 font-bold uppercase transition-colors ${activeTab === 'shared' ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
        >
          Compartidos ({sharedJobs.length})
        </button>
      </div>

      {loading ? (
        <p>Cargando anuncios...</p>
      ) : (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Vista Mobile (Tarjetas) */}
          <div className="block xl:hidden mt-4 space-y-4">
            {displayedJobs.map((job) => (
              <div key={job._id} className="bg-gray-50 border-2 border-black p-4 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <div className="font-black uppercase">{job.studioName}</div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{job.title} en {job.category}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-4 border-t-2 border-black">
                  <button 
                    onClick={() => generateAndDownloadStory(job, 'share')}
                    disabled={renderingJobId === job._id}
                    className="p-2 bg-black text-white rounded-none hover:bg-black/80 transition-colors flex items-center gap-2"
                    title="Compartir (Móvil) o Descargar"
                  >
                    {renderingJobId === job._id ? <span className="animate-spin text-sm">...</span> : <Share2 className="w-4 h-4" />}
                    <span className="text-[10px] uppercase font-bold">Compartir</span>
                  </button>

                  <button 
                    onClick={() => generateAndDownloadStory(job, 'download')}
                    disabled={renderingJobId === job._id}
                    className="p-2 border-2 border-black text-black rounded-none hover:bg-white transition-colors"
                    title="Descargar PNG"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => copyLink(job._id)}
                    className="p-2 border-2 border-black text-black rounded-none hover:bg-white transition-colors"
                    title="Copiar Enlace (Para Sticker)"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => toggleStatus(job._id, job.sharedOnInstagram)}
                    className={`p-2 border-2 rounded-none transition-colors ${job.sharedOnInstagram ? 'border-green-800 bg-green-100 text-green-800' : 'border-black text-black hover:bg-white'}`}
                    title={job.sharedOnInstagram ? "Marcar como Pendiente" : "Marcar como Compartido"}
                  >
                    {job.sharedOnInstagram ? <CheckCircle className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            {displayedJobs.length === 0 && (
              <div className="p-8 text-center text-muted-foreground border-2 border-black font-bold uppercase text-xs">
                No hay anuncios en esta lista.
              </div>
            )}
          </div>

          {/* Vista Desktop (Tabla) */}
          <div className="hidden xl:block overflow-x-auto border-t-2 border-black">
            <table className="w-full text-left bg-white min-w-[700px]">
              <thead className="bg-gray-50 border-b-2 border-black">
                <tr>
                  <th className="p-4 text-xs font-black text-black uppercase">Estudio</th>
                  <th className="p-4 text-xs font-black text-black uppercase">Puesto & Categoría</th>
                  <th className="p-4 text-xs font-black text-black uppercase text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-black divide-y-2 divide-gray-200">
                {displayedJobs.map(job => (
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-black uppercase">{job.studioName}</td>
                    <td className="p-4 uppercase font-bold text-muted-foreground">{job.title} en {job.category}</td>
                    <td className="p-4 flex items-center justify-center space-x-2">
                      
                      {/* Botón de Compartir Nativo (Móvil) o Descargar */}
                      <button 
                        onClick={() => generateAndDownloadStory(job, 'share')}
                        disabled={renderingJobId === job._id}
                        className="p-2 border-2 border-black bg-black text-white rounded-none hover:bg-black/80 transition-colors flex items-center space-x-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px]"
                        title="Compartir (Móvil) o Descargar"
                      >
                        {renderingJobId === job._id ? <span className="animate-spin text-sm">...</span> : <Share2 className="w-4 h-4" />}
                        <span className="text-xs uppercase font-bold hidden md:inline">Compartir</span>
                      </button>

                      <button 
                        onClick={() => generateAndDownloadStory(job, 'download')}
                        disabled={renderingJobId === job._id}
                        className="p-2 border-2 border-black text-black rounded-none hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px]"
                        title="Descargar PNG"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => copyLink(job._id)}
                        className="p-2 border-2 border-black text-black rounded-none hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px]"
                        title="Copiar Enlace (Para Sticker)"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => toggleStatus(job._id, job.sharedOnInstagram)}
                        className={`p-2 border-2 rounded-none transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] ${job.sharedOnInstagram ? 'border-green-800 text-green-800 bg-green-100 hover:bg-green-200' : 'border-black text-black hover:bg-gray-100'}`}
                        title={job.sharedOnInstagram ? "Marcar como Pendiente" : "Marcar como Compartido"}
                      >
                        {job.sharedOnInstagram ? <CheckCircle className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                    </td>
                  </tr>
                ))}
                {displayedJobs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted-foreground font-bold uppercase text-sm">
                      No hay anuncios en esta lista.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Renderizado Oculto Fuera de Pantalla */}
      {renderingJobId && (
        <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', zIndex: -1 }}>
          {jobs.filter(j => j._id === renderingJobId).map(job => (
            <InstagramStoryTemplate
              key={job._id}
              ref={templateRef}
              studioName={job.studioName}
              category={job.title}
              location={job.location}
            />
          ))}
        </div>
      )}

    </div>
  );
}
