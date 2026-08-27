"use client";

import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { JobCard } from "@/components/ui/JobCard";

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

  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number; isFree: boolean } | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponMessage(null);

    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, jobId: id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCouponMessage({ type: "error", text: data.error || "Error al validar el cupón" });
        return;
      }

      if (data.isFree) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discountPercent: 100, isFree: true });
        setCouponMessage({ type: "success", text: "¡Cupón del 100% aplicado! Redirigiendo a la confirmación..." });
        if (data.redirectUrl) {
          setTimeout(() => {
            router.push(data.redirectUrl);
          }, 1000);
        }
      } else {

        setAppliedCoupon({ code: couponCode.toUpperCase(), discountPercent: data.discountPercent, isFree: false });
        setCouponMessage({ type: "success", text: data.message });
      }
    } catch (error) {
      console.error("Coupon Fetch Error:", error);
      setCouponMessage({ type: "error", text: "Error de conexión al aplicar el cupón" });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleFreeActivation = async () => {
    if (!appliedCoupon?.isFree) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: appliedCoupon.code, jobId: id }),
      });
      const data = await res.json();

      if (res.ok && data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        alert(data.error || "No se pudo activar el anuncio con el cupón.");
      }
    } catch (error) {
      console.error("Free Activation Error:", error);
      alert("Error al activar el aviso gratuito.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (appliedCoupon?.isFree) {
      return handleFreeActivation();
    }
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
            <div className="w-full max-w-[280px] transform -rotate-2 hover:rotate-0 transition-transform duration-300 origin-top-left scale-75 sm:scale-100">
              <div className="pointer-events-none">
                <JobCard 
                  index={0}
                  studioName={job?.studioName || "Estudio"}
                  role={job?.title || "Sin título"}
                  specialty={job?.category || "Especialidad"}
                  location={job?.location || "Ubicación"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Card */}
        <div className="flex items-center">
          <div className="bg-white border border-border w-full">
            
            {/* Total row */}
            <div className="p-8 md:p-12 border-b border-border bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-sm text-muted-foreground block">Total a Pagar</span>
                <span className="bg-black text-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full">
                  {appliedCoupon?.isFree ? "🎁 CUPÓN 100% GRATIS" : "🔥 75% OFF LANZAMIENTO"}
                </span>
              </div>
              <div className="flex items-baseline space-x-3">
                {appliedCoupon?.isFree ? (
                  <span className="text-display-lg font-bold text-green-600">$ 0 ARS</span>
                ) : (
                  <>
                    <span className="text-body text-muted-foreground line-through">$ 20.000</span>
                    <span className="text-display-lg font-bold">$ 5.000</span>
                  </>
                )}
              </div>
            </div>

            {/* Cupón de Descuento */}
            <div className="p-8 md:p-12 border-b border-border space-y-3">
              <label className="text-label-sm text-muted-foreground block font-medium">¿Tienes un código promocional?</label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Ej. EJEMPLO-DESC20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={appliedCoupon?.isFree || isProcessing}
                  className="flex-1 border border-border px-4 py-2.5 outline-none text-body focus:border-black uppercase transition-colors"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !couponCode.trim() || appliedCoupon?.isFree}
                  className="bg-black text-white px-5 py-2.5 text-button hover:bg-black/90 disabled:opacity-50 transition-opacity"
                >
                  {isApplyingCoupon ? "..." : "APLICAR"}
                </button>
              </form>
              {couponMessage && (
                <p className={`text-caption-sm ${couponMessage.type === "success" ? "text-green-600 font-semibold" : "text-red-500"}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Mercado Pago / Activación Gratuita */}
            <div className="p-8 md:p-12">
              <button 
                type="button" 
                disabled={isProcessing}
                onClick={handlePayment}
                className={`w-full bg-black text-white py-5 flex items-center justify-center space-x-3 transition-opacity duration-200 ease-editorial ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
              >
                <span className="text-button">
                  {isProcessing 
                    ? "PROCESANDO..." 
                    : appliedCoupon?.isFree 
                      ? "🚀 ACTIVAR MI ANUNCIO GRATIS AHORA" 
                      : "PAGAR CON MERCADO PAGO"}
                </span>
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

