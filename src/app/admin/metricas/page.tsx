"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, ShoppingCart, RefreshCw, Award, Activity, MessageSquare, AtSign, Eye } from "lucide-react";

interface MetricsData {
  totalJobs: number;
  activeJobs: number;
  pendingJobs: number;
  couponJobs: number;
  paidJobs: number;
  totalStudios: number;
  totalCoupons: number;
  whatsappClicks: number;
  instagramClicks: number;
  jobViews: number;
  studioViews: number;
  b2bConversionRate: string;
  abandonedRate: string;
  interactionsPerActiveJob: string;
}

export default function AdminMetricasPage() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error al cargar métricas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-black font-bold uppercase text-sm">
        Cargando analíticas avanzadas del marketplace...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-black uppercase tracking-tight">Métricas & Salud del Marketplace</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mt-1">
            Análisis de embudo de conversión B2B, tasas de retención y liquidez entre estudios y artistas.
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar Analítica</span>
        </button>
      </div>

      {/* Primary Funnel Ratios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: B2B Conversion Rate */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider">Conversión B2B</span>
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-gray-50">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-5xl font-black">{data.b2bConversionRate}%</p>
            <p className="text-xs font-bold uppercase text-muted-foreground mt-4 leading-relaxed">
              Promedio de avisos activos creados por cada estudio registrado ({data.activeJobs} publicaciones activas / {data.totalStudios} estudios).
            </p>
          </div>
        </div>

        {/* Metric 2: Abandoned Rate */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider">Tasa de Abandono Checkout</span>
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-gray-50">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-5xl font-black">{data.abandonedRate}%</p>
            <p className="text-xs font-bold uppercase text-muted-foreground mt-4 leading-relaxed">
              Publicaciones iniciadas que quedaron en estado pendiente de pago ({data.pendingJobs} de {data.totalJobs}).
            </p>
          </div>
        </div>

        {/* Metric 3: Liquidity Index */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider">Liquidez P2P</span>
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-gray-50">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-5xl font-black">{data.interactionsPerActiveJob}</p>
            <p className="text-xs font-bold uppercase text-muted-foreground mt-4 leading-relaxed">
              Contactos directos generados (WhatsApp + Instagram) por cada aviso activo publicado.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interaction Source Breakdown */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-sm font-black uppercase tracking-wider mb-6 pb-4 border-b-2 border-black">Interacciones y Engagement Artista ➔ Estudio</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-black hover:bg-white transition-colors">
              <div className="flex items-center gap-4">
                <MessageSquare className="w-6 h-6 text-black" />
                <div>
                  <p className="text-sm font-black uppercase text-black">Clics de WhatsApp</p>
                  <p className="text-xs font-bold uppercase text-muted-foreground">Mensajes directos iniciados con estudios</p>
                </div>
              </div>
              <span className="text-2xl font-black text-black">{data.whatsappClicks}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-black hover:bg-white transition-colors">
              <div className="flex items-center gap-4">
                <AtSign className="w-6 h-6 text-black" />
                <div>
                  <p className="text-sm font-black uppercase text-black">Clics de Instagram</p>
                  <p className="text-xs font-bold uppercase text-muted-foreground">Redirecciones al perfil social del estudio</p>
                </div>
              </div>
              <span className="text-2xl font-black text-black">{data.instagramClicks}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-black hover:bg-white transition-colors">
              <div className="flex items-center gap-4">
                <Eye className="w-6 h-6 text-black" />
                <div>
                  <p className="text-sm font-black uppercase text-black">Lecturas de Avisos</p>
                  <p className="text-xs font-bold uppercase text-muted-foreground">Vistas completas de publicaciones de empleo</p>
                </div>
              </div>
              <span className="text-2xl font-black text-black">{data.jobViews}</span>
            </div>
          </div>
        </div>

        {/* Monetization & Promo Source */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-sm font-black uppercase tracking-wider mb-6 pb-4 border-b-2 border-black">Adopción y Distribución de Anuncios</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border-2 border-black">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-black uppercase text-black">Anuncios con Cupones Promocionales</span>
                <span className="text-2xl font-black text-purple-700">{data.couponJobs}</span>
              </div>
              <p className="text-xs font-bold uppercase text-muted-foreground leading-relaxed">
                Avisos que utilizaron códigos de descuento o promociones especiales para su publicación.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border-2 border-black">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-black uppercase text-black">Anuncios Pagados Directos (Mercado Pago)</span>
                <span className="text-2xl font-black text-green-700">{data.paidJobs}</span>
              </div>
              <p className="text-xs font-bold uppercase text-muted-foreground leading-relaxed">
                Avisos cobrados a precio completo sin cupón mediante la pasarela de pago.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border-2 border-black">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-black uppercase text-black">Estudios Registrados Totales</span>
                <span className="text-2xl font-black text-black">{data.totalStudios}</span>
              </div>
              <p className="text-xs font-bold uppercase text-muted-foreground leading-relaxed">
                Cuentas de estudios con perfil activo creados en la plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
