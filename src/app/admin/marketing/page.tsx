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
        <div className="bg-white border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-700 uppercase">Estudio</th>
                <th className="p-4 text-xs font-bold text-gray-700 uppercase">Búsqueda</th>
                <th className="p-4 text-xs font-bold text-gray-700 uppercase text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {displayedJobs.map(job => (
                <tr key={job._id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold uppercase">{job.studioName}</td>
                  <td className="p-4 uppercase">{job.title} en {job.category}</td>
                  <td className="p-4 flex items-center justify-center space-x-2">
                    
                    {/* Botón de Compartir Nativo (Móvil) o Descargar */}
                    <button 
                      onClick={() => generateAndDownloadStory(job, 'share')}
                      disabled={renderingJobId === job._id}
                      className="p-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors flex items-center space-x-2"
                      title="Compartir (Móvil) o Descargar"
                    >
                      {renderingJobId === job._id ? <span className="animate-spin text-sm">...</span> : <Share2 className="w-4 h-4" />}
                      <span className="text-xs uppercase font-bold hidden md:inline">Compartir</span>
                    </button>

                    <button 
                      onClick={() => generateAndDownloadStory(job, 'download')}
                      disabled={renderingJobId === job._id}
                      className="p-2 border border-black text-black rounded-md hover:bg-gray-100 transition-colors"
                      title="Descargar PNG"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => copyLink(job._id)}
                      className="p-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                      title="Copiar Enlace (Para Sticker)"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => toggleStatus(job._id, job.sharedOnInstagram)}
                      className={`p-2 border rounded-md transition-colors ${job.sharedOnInstagram ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                      title={job.sharedOnInstagram ? "Marcar como Pendiente" : "Marcar como Compartido"}
                    >
                      {job.sharedOnInstagram ? <CheckCircle className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                  </td>
                </tr>
              ))}
              {displayedJobs.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted-foreground">
                    No hay anuncios en esta lista.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
              category={job.category}
              location={job.location}
            />
          ))}
        </div>
      )}

    </div>
  );
}
