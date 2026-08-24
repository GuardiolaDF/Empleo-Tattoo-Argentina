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
  AtSign,
  Eye,
  TrendingUp
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectToDatabase();

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

  let totalRevenue = 0;
  let monthlyRevenue = 0;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const activeJobsData = await Job.find({ status: "active" }).select("pricePaid couponCode paymentId createdAt updatedAt").lean();
  
  activeJobsData.forEach((job: any) => {
    let amountPaid = job.pricePaid || 0;
    if (!job.pricePaid && job.pricePaid !== 0) {
      const isCoupon = job.couponCode || (job.paymentId && job.paymentId.toString().includes('CUPON'));
      amountPaid = isCoupon ? 0 : 5000;
    }
    totalRevenue += amountPaid;

    const jobDate = new Date(job.updatedAt || job.createdAt);
    if (jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear) {
      monthlyRevenue += amountPaid;
    }
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="mb-10">
        <h1 className="text-display-sm font-black uppercase mb-2">Panel de Control</h1>
        <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm">Resumen en tiempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1: Empleos Activos */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider">Avisos Totales</span>
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-gray-50">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-5xl font-black">{totalJobs}</p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase mt-4">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> {activeJobs} activos
              </span>
              <span className="flex items-center gap-1 text-amber-500">
                <Clock className="w-4 h-4" /> {pendingJobs} pdtes.
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Estudios Registrados */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider">Estudios</span>
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-gray-50">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-5xl font-black">{totalStudios}</p>
            <p className="text-xs font-bold uppercase text-muted-foreground mt-4">
              Perfiles creados
            </p>
          </div>
        </div>

        {/* Card 3: Cupones de Anuncio */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider">Cupones</span>
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-gray-50">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-5xl font-black">{couponJobs}</p>
            <p className="text-xs font-bold uppercase text-muted-foreground mt-4">
              {activeCoupons} activos de {totalCoupons} creados
            </p>
          </div>
        </div>

        {/* Card 4: Ingresos Financieros */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider">Ingresos</span>
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-gray-50">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black truncate" title={`$${totalRevenue.toLocaleString("es-AR")}`}>
              ${totalRevenue > 999999 ? (totalRevenue/1000000).toFixed(1) + 'M' : totalRevenue.toLocaleString("es-AR")}
            </p>
            <p className="text-xs font-bold uppercase text-muted-foreground mt-4">
              <span className="text-black font-black">${monthlyRevenue.toLocaleString("es-AR")}</span> este mes
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Tráfico y Conversión */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-sm font-black uppercase tracking-wider mb-6 pb-4 border-b-2 border-black flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-black" />
            Métricas de Conversión
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Eye className="w-4 h-4 text-black" /> Vistas de Avisos
              </span>
              <span className="text-xl font-black">{jobViews}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-black" /> Clics a WhatsApp
              </span>
              <span className="text-xl font-black">{whatsappClicks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <AtSign className="w-4 h-4 text-black" /> Clics a Instagram
              </span>
              <span className="text-xl font-black">{instagramClicks}</span>
            </div>
          </div>
        </div>

        {/* Col 2 & 3: Últimos Avisos */}
        <div className="lg:col-span-2 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
            <h2 className="text-sm font-black uppercase tracking-wider">Últimos Avisos</h2>
            <Link href="/admin/avisos" className="text-xs font-bold uppercase text-black hover:underline flex items-center gap-1">
              Ver todos <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          
          {/* Vista Mobile (Tarjetas) */}
          <div className="block xl:hidden mt-4 space-y-4">
            {recentJobs.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm font-bold uppercase border-2 border-black">
                No hay avisos recientes
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job._id.toString()} className="bg-gray-50 border-2 border-black p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-black uppercase text-black">{job.studioName}</div>
                      <div className="text-xs font-bold text-muted-foreground uppercase mt-1">{job.title}</div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-wider border-2 ${
                      job.status === "active" 
                        ? "bg-green-100 text-green-800 border-green-800" 
                        : job.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-800"
                        : "bg-gray-100 text-gray-800 border-gray-800"
                    }`}>
                      {job.status === "active" ? "Activo" : job.status === "pending" ? "Pdte" : "Inactivo"}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-black text-right pt-2 border-t-2 border-black">
                    {new Date(job.createdAt).toLocaleDateString("es-AR")}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vista Desktop (Tabla) */}
          <div className="hidden xl:block overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="pb-3 text-xs font-black text-black uppercase tracking-wider">Estudio</th>
                  <th className="pb-3 text-xs font-black text-black uppercase tracking-wider">Puesto</th>
                  <th className="pb-3 text-xs font-black text-black uppercase tracking-wider">Estado</th>
                  <th className="pb-3 text-xs font-black text-black uppercase tracking-wider text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentJobs.map((job) => (
                  <tr key={job._id.toString()} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm font-bold uppercase text-black max-w-[150px] truncate">
                      {job.studioName}
                    </td>
                    <td className="py-4 text-sm font-bold text-muted-foreground uppercase">
                      {job.title}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-none text-xs font-bold uppercase tracking-wider border-2 ${
                        job.status === "active" 
                          ? "bg-green-100 text-green-800 border-green-800" 
                          : job.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-800"
                          : "bg-gray-100 text-gray-800 border-gray-800"
                      }`}>
                        {job.status === "active" ? "Activo" : job.status === "pending" ? "Pendiente" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-black text-right font-bold">
                      {new Date(job.createdAt).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))}
                {recentJobs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm font-bold uppercase">
                      No hay avisos recientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
