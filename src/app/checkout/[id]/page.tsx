"use client";

import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    if (!id) return;
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data.job);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        body: JSON.stringify({ jobId: id }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("MP Fetch Error:", data);
        alert("Error al crear pago. Revisa la consola.");
        return;
      }

      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error("Fetch Exception:", error);
      alert("Error de red al crear pago. Revisa la consola.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-body text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
        
        {/* Left Column: Summary Info */}
        <div className="flex flex-col">
          <button onClick={() => router.back()} className="flex items-center space-x-2 text-muted-foreground hover:text-black transition-colors mb-24 self-start">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-nav">Volver</span>
          </button>
          
          <h1 className="text-display-xl mb-16 uppercase">
            RESUMEN
          </h1>
          
          <div className="flex">
            {/* Vertical Divider Line */}
            <div className="w-[2px] bg-black mr-6"></div>
            
            <div className="flex flex-col justify-center py-4">
              <span className="text-label-sm text-muted-foreground mb-2">
                Ítem
              </span>
              <p className="text-subtitle">
                Publicación de Oferta — Editable por 30 días
              </p>
            </div>
          </div>

          <div className="mt-24">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-8 h-[1px] bg-border"></div>
              <span className="text-label-sm text-muted-foreground">
                Vista Previa
              </span>
            </div>
            
            {/* Mini Preview Card */}
            <div className="bg-white border border-border p-6 w-full max-w-xs transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <span className="text-caption-sm text-muted-foreground mb-2 block">Oferta de Empleo</span>
              <h3 className="text-h3 mb-1 break-words line-clamp-2">{job?.title || "Sin título"}</h3>
              <p className="text-body-sm text-muted-foreground break-words line-clamp-1">en {job?.studioName || "Estudio"}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Card */}
        <div className="flex items-center">
          <div className="bg-white border border-border w-full">
            
            {/* Total row */}
            <div className="p-8 md:p-12 border-b border-border bg-gray-50/50">
              <span className="text-label-sm text-muted-foreground mb-2 block">Total a Pagar</span>
              <span className="text-display-lg">$ 20.000</span>
            </div>

            {/* Mercado Pago area */}
            <div className="p-8 md:p-12">
              
              <button 
                type="button" 
                disabled={isProcessing}
                onClick={handlePayment}
                className={`w-full bg-black text-white py-5 flex items-center justify-center space-x-3 transition-opacity duration-200 ease-editorial ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
              >
                <span className="text-button">{isProcessing ? "PROCESANDO..." : "PAGAR CON MERCADO PAGO"}</span>
                {!isProcessing && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
