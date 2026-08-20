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
      <div className="p-12 text-center text-zinc-500 text-sm">
        Cargando analíticas avanzadas del marketplace...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Métricas & Salud del Marketplace</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Análisis de embudo de conversión B2B, tasas de retención y liquidez entre estudios y artistas.
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualizar Analítica</span>
        </button>
      </div>

      {/* Primary Funnel Ratios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: B2B Conversion Rate */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Conversión B2B</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-extrabold text-white">{data.b2bConversionRate}%</p>
            <p className="text-xs text-zinc-400 mt-2">
              Promedio de avisos activos creados por cada estudio registrado ({data.activeJobs} publicaciones activas / {data.totalStudios} estudios).
            </p>
          </div>
        </div>

        {/* Metric 2: Abandoned Rate */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Tasa de Abandono Checkout</span>
            <div className="w-9 h-9 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center border border-amber-800/60">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-extrabold text-white">{data.abandonedRate}%</p>
            <p className="text-xs text-zinc-400 mt-2">
              Publicaciones iniciadas que quedaron en estado pendiente de pago ({data.pendingJobs} de {data.totalJobs}).
            </p>
          </div>
        </div>

        {/* Metric 3: Liquidity Index */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Liquidez P2P</span>
            <div className="w-9 h-9 rounded-lg bg-sky-950/80 text-sky-400 flex items-center justify-center border border-sky-800/60">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-extrabold text-white">{data.interactionsPerActiveJob}</p>
            <p className="text-xs text-zinc-400 mt-2">
              Contactos directos generados (WhatsApp + Instagram) por cada aviso activo publicado.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interaction Source Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Interacciones y Engagement Artista ➔ Estudio</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800/80">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Clics de WhatsApp</p>
                  <p className="text-xs text-zinc-400">Mensajes directos iniciados con estudios</p>
                </div>
              </div>
              <span className="text-xl font-bold text-emerald-400">{data.whatsappClicks}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800/80">
              <div className="flex items-center gap-3">
                <AtSign className="w-5 h-5 text-pink-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Clics de Instagram</p>
                  <p className="text-xs text-zinc-400">Redirecciones al perfil social del estudio</p>
                </div>
              </div>
              <span className="text-xl font-bold text-pink-400">{data.instagramClicks}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800/80">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Lecturas de Avisos</p>
                  <p className="text-xs text-zinc-400">Vistas completas de publicaciones de empleo</p>
                </div>
              </div>
              <span className="text-xl font-bold text-blue-400">{data.jobViews}</span>
            </div>
          </div>
        </div>

        {/* Monetization & Promo Source */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Adopción y Distribución de Anuncios</h2>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800/80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-white">Anuncios con Cupones Promocionales</span>
                <span className="text-sm font-bold text-purple-400">{data.couponJobs}</span>
              </div>
              <p className="text-xs text-zinc-400">
                Avisos que utilizaron códigos de descuento o promociones especiales para su publicación.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800/80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-white">Anuncios Pagados Directos (Mercado Pago)</span>
                <span className="text-sm font-bold text-emerald-400">{data.paidJobs}</span>
              </div>
              <p className="text-xs text-zinc-400">
                Avisos cobrados a precio completo sin cupón mediante la pasarela de pago.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800/80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-white">Estudios Registrados Totales</span>
                <span className="text-sm font-bold text-sky-400">{data.totalStudios}</span>
              </div>
              <p className="text-xs text-zinc-400">
                Cuentas de estudios con perfil activo creados en la plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
