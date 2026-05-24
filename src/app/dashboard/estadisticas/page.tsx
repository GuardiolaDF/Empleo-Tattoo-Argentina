"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, MessageCircle, AtSign, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AnalyticsData {
  totals: Record<string, number>;
  thisWeek: Record<string, number>;
  lastWeek: Record<string, number>;
  daily: { date: string; count: number }[];
  perJob: { _id: string; count: number }[];
}

interface JobInfo {
  _id: string;
  title: string;
  studioName: string;
}

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function EstadisticasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [jobsMap, setJobsMap] = useState<Record<string, JobInfo>>({});
  const [studioName, setStudioName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard/estadisticas");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchAll() {
      try {
        const [analyticsRes, jobsRes, studioRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/my-jobs"),
          fetch("/api/studio"),
        ]);

        if (analyticsRes.ok) {
          setData(await analyticsRes.json());
        }
        if (jobsRes.ok) {
          const jobs: JobInfo[] = await jobsRes.json();
          const map: Record<string, JobInfo> = {};
          jobs.forEach((j) => (map[j._id] = j));
          setJobsMap(map);
        }
        if (studioRes.ok) {
          const studio = await studioRes.json();
          if (studio?.nombre) setStudioName(studio.nombre);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [status]);

  // Helper to calc percentage change
  const pctChange = (current: number, previous: number): { value: number; direction: "up" | "down" | "flat" } => {
    if (previous === 0 && current === 0) return { value: 0, direction: "flat" };
    if (previous === 0) return { value: 100, direction: "up" };
    const change = Math.round(((current - previous) / previous) * 100);
    return {
      value: Math.abs(change),
      direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
    };
  };

  // Build daily chart data for last 7 days
  const buildDailyChart = () => {
    const days: { label: string; count: number; dateStr: string }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const dayIndex = d.getDay();
      const found = data?.daily?.find((dd) => dd.date === dateStr);
      days.push({
        label: DAY_LABELS[dayIndex],
        count: found?.count || 0,
        dateStr,
      });
    }
    return days;
  };

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

  const kpis = [
    {
      label: "Vistas de Avisos",
      icon: Eye,
      total: data?.totals?.job_view || 0,
      week: data?.thisWeek?.job_view || 0,
      prevWeek: data?.lastWeek?.job_view || 0,
    },
    {
      label: "Clics WhatsApp",
      icon: MessageCircle,
      total: data?.totals?.whatsapp_click || 0,
      week: data?.thisWeek?.whatsapp_click || 0,
      prevWeek: data?.lastWeek?.whatsapp_click || 0,
    },
    {
      label: "Clics Instagram",
      icon: AtSign,
      total: data?.totals?.instagram_click || 0,
      week: data?.thisWeek?.instagram_click || 0,
      prevWeek: data?.lastWeek?.instagram_click || 0,
    },
    {
      label: "Vistas de Perfil",
      icon: Users,
      total: data?.totals?.studio_view || 0,
      week: data?.thisWeek?.studio_view || 0,
      prevWeek: data?.lastWeek?.studio_view || 0,
    },
  ];

  const dailyChart = buildDailyChart();
  const maxDaily = Math.max(...dailyChart.map((d) => d.count), 1);

  const totalInteractions =
    (data?.totals?.job_view || 0) +
    (data?.totals?.whatsapp_click || 0) +
    (data?.totals?.instagram_click || 0) +
    (data?.totals?.studio_view || 0);

  const breakdown = [
    { label: "Vistas de Avisos", count: data?.totals?.job_view || 0, color: "bg-black" },
    { label: "WhatsApp", count: data?.totals?.whatsapp_click || 0, color: "bg-neutral-600" },
    { label: "Instagram", count: data?.totals?.instagram_click || 0, color: "bg-neutral-400" },
    { label: "Perfil", count: data?.totals?.studio_view || 0, color: "bg-neutral-300" },
  ];

  const maxPerJob = Math.max(...(data?.perJob?.map((j) => j.count) || [1]), 1);

  const hasData = totalInteractions > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row border-t border-border">
        <DashboardSidebar studioName={studioName} />

        <section className="flex-1 p-8 md:p-12 lg:p-16 min-w-0">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-display-xl mb-2">Estadísticas</h1>
            <p className="text-body-sm text-muted-foreground">
              Rendimiento de tus publicaciones y perfil
            </p>
          </div>

          {!hasData ? (
            /* Empty State */
            <div className="bg-white border border-border p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-8">
                <Eye className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-h3 mb-4">Sin datos todavía</h3>
              <p className="text-body-sm text-muted-foreground max-w-sm">
                Las estadísticas se generan cuando artistas visitan tus
                publicaciones y hacen clic en tus datos de contacto. Publicá
                un aviso para empezar a recibir tráfico.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => {
                  const change = pctChange(kpi.week, kpi.prevWeek);
                  return (
                    <div
                      key={kpi.label}
                      className="bg-white border border-border p-6 flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <kpi.icon className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center gap-1">
                          {change.direction === "up" && (
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          )}
                          {change.direction === "down" && (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                          {change.direction === "flat" && (
                            <Minus className="w-3 h-3 text-muted-foreground" />
                          )}
                          <span
                            className={`text-caption-sm ${
                              change.direction === "up"
                                ? "text-green-600"
                                : change.direction === "down"
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {change.value}%
                          </span>
                        </div>
                      </div>
                      <span className="text-display-lg mb-1">{kpi.total}</span>
                      <span className="text-caption-sm text-muted-foreground">
                        {kpi.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Two columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Chart - Last 7 Days */}
                <div className="bg-white border border-border p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-label-sm text-muted-foreground uppercase tracking-wider">
                      Actividad — Últimos 7 Días
                    </h3>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-32">
                    {dailyChart.map((day) => (
                      <div
                        key={day.dateStr}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <span className="text-caption-sm text-muted-foreground">
                          {day.count > 0 ? day.count : ""}
                        </span>
                        <div
                          className="w-full bg-black transition-all duration-500 ease-editorial min-h-[2px]"
                          style={{
                            height: `${Math.max(
                              (day.count / maxDaily) * 100,
                              2
                            )}%`,
                          }}
                        />
                        <span className="text-caption-sm text-muted-foreground">
                          {day.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interaction Breakdown */}
                <div className="bg-white border border-border p-8">
                  <h3 className="text-label-sm text-muted-foreground uppercase tracking-wider mb-8">
                    Desglose de Interacciones
                  </h3>
                  <div className="space-y-5">
                    {breakdown.map((item) => {
                      const pct =
                        totalInteractions > 0
                          ? Math.round((item.count / totalInteractions) * 100)
                          : 0;
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between mb-2">
                            <span className="text-body-sm">{item.label}</span>
                            <span className="text-label-sm text-muted-foreground">
                              {item.count}{" "}
                              <span className="text-caption-sm">({pct}%)</span>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full ${item.color} transition-all duration-700 ease-editorial`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Per-Job Views */}
              {data?.perJob && data.perJob.length > 0 && (
                <div className="bg-white border border-border p-8">
                  <h3 className="text-label-sm text-muted-foreground uppercase tracking-wider mb-8">
                    Vistas por Publicación
                  </h3>
                  <div className="space-y-4">
                    {data.perJob.map((item) => {
                      const job = jobsMap[item._id];
                      const pct = Math.round((item.count / maxPerJob) * 100);
                      return (
                        <div key={item._id}>
                          <div className="flex justify-between mb-2">
                            <span className="text-body-sm truncate max-w-[70%]">
                              {job
                                ? `${job.title} — ${job.studioName}`
                                : item._id}
                            </span>
                            <span className="text-label-sm font-medium">
                              {item.count}
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-100 overflow-hidden">
                            <div
                              className="h-full bg-black transition-all duration-700 ease-editorial"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
