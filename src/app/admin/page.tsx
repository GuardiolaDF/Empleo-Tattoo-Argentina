import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";
import Studio from "@/models/Studio";
import Coupon from "@/models/Coupon";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  Ticket,
  MousePointerClick,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Instagram,
  Eye
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  // Consultas paralelas a MongoDB para máxima velocidad de renderizado
  const [
    totalJobs,
    activeJobs,
    pendingJobs,
    couponJobs,
    totalStudios,
    totalCoupons,
    activeCoupons,
    whatsappClicks,
    instagramClicks,
    jobViews,
    recentJobs
  ] = await Promise.all([
    Job.countDocuments(),
    Job.countDocuments({ status: "active" }),
    Job.countDocuments({ status: "pending" }),
    Job.countDocuments({ couponCode: { $exists: true, $ne: "" } }),
    Studio.countDocuments(),
    Coupon.countDocuments(),
    Coupon.countDocuments({ active: true }),
    AnalyticsEvent.countDocuments({ eventType: "whatsapp_click" }),
    AnalyticsEvent.countDocuments({ eventType: "instagram_click" }),
    AnalyticsEvent.countDocuments({ eventType: "job_view" }),
    Job.find().sort({ createdAt: -1 }).limit(5).lean()
  ]);

  // Cálculo de ratio de liquidez
  const totalInteractions = whatsappClicks + instagramClicks;
  const avgInteractionsPerActiveJob = activeJobs > 0 
    ? (totalInteractions / activeJobs).toFixed(1) 
    : "0";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Resumen General</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Información en tiempo real del estado de la plataforma y salud del marketplace.
        </p>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Avisos Totales */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avisos Totales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white">{totalJobs}</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> {activeJobs} activos
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <Clock className="w-3.5 h-3.5" /> {pendingJobs} pendientes
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Estudios Registrados */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Estudios Registrados</span>
            <div className="w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-800/40 flex items-center justify-center text-sky-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white">{totalStudios}</p>
            <p className="text-xs text-zinc-400 mt-2">
              Perfiles creados en la plataforma
            </p>
          </div>
        </div>

        {/* Card 3: Cupones de Anuncio */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Publicados con Cupón</span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white">{couponJobs}</p>
            <p className="text-xs text-zinc-400 mt-2">
              {activeCoupons} cupones activos de {totalCoupons} creados
            </p>
          </div>
        </div>

        {/* Card 4: Interacciones B2P */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Clics de Contacto</span>
            <div className="w-8 h-8 rounded-lg bg-orange-950/60 border border-orange-800/40 flex items-center justify-center text-orange-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white">{totalInteractions}</p>
            <p className="text-xs text-zinc-400 mt-2">
              ~{avgInteractionsPerActiveJob} contactos por aviso activo
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Detail */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 lg:col-span-1">
          <h2 className="text-base font-bold text-white mb-4">Métricas de Interacción</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Clics WhatsApp</p>
                  <p className="text-xs text-zinc-400">Contactos directos</p>
                </div>
              </div>
              <span className="text-lg font-bold text-emerald-400">{whatsappClicks}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-pink-950/80 text-pink-400 flex items-center justify-center">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Clics Instagram</p>
                  <p className="text-xs text-zinc-400">Visitas a perfil</p>
                </div>
              </div>
              <span className="text-lg font-bold text-pink-400">{instagramClicks}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-950/80 text-blue-400 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Vistas de Avisos</p>
                  <p className="text-xs text-zinc-400">Lecturas de publicaciones</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-400">{jobViews}</span>
            </div>
          </div>
        </div>

        {/* Recent Job Activity */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Últimas Publicaciones</h2>
            <Link
              href="/admin/avisos"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Ver todos <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <p className="text-sm text-zinc-500 py-8 text-center">No hay publicaciones registradas aún.</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job: any) => (
                <div
                  key={job._id.toString()}
                  className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-lg border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-white truncate max-w-xs">{job.title}</p>
                    <p className="text-xs text-zinc-400">
                      {job.studioName} &bull; <span className="text-zinc-500">{job.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {job.couponCode && (
                      <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60 rounded">
                        {job.couponCode}
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        job.status === "active"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                          : "bg-amber-950 text-amber-300 border border-amber-800/60"
                      }`}
                    >
                      {job.status === "active" ? "Activo" : "Pendiente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
