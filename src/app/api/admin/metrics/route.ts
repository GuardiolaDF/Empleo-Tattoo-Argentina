import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";
import Studio from "@/models/Studio";
import Coupon from "@/models/Coupon";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectToDatabase();

    const [
      totalJobs,
      activeJobs,
      pendingJobs,
      couponJobs,
      paidJobs,
      totalStudios,
      totalCoupons,
      whatsappClicks,
      instagramClicks,
      jobViews,
      studioViews
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: "active" }),
      Job.countDocuments({ status: "pending" }),
      Job.countDocuments({ couponCode: { $exists: true, $ne: "" } }),
      Job.countDocuments({ status: "active", couponCode: { $exists: false } }),
      Studio.countDocuments(),
      Coupon.countDocuments(),
      AnalyticsEvent.countDocuments({ eventType: "whatsapp_click" }),
      AnalyticsEvent.countDocuments({ eventType: "instagram_click" }),
      AnalyticsEvent.countDocuments({ eventType: "job_view" }),
      AnalyticsEvent.countDocuments({ eventType: "studio_view" }),
    ]);

    // Ratios de conversión B2B
    const b2bConversionRate = totalStudios > 0
      ? ((activeJobs / totalStudios) * 100).toFixed(1)
      : "0";

    const abandonedRate = totalJobs > 0
      ? ((pendingJobs / totalJobs) * 100).toFixed(1)
      : "0";

    // Ratio de liquidez (Interacciones por aviso activo)
    const totalInteractions = whatsappClicks + instagramClicks;
    const interactionsPerActiveJob = activeJobs > 0
      ? (totalInteractions / activeJobs).toFixed(1)
      : "0";

    return NextResponse.json({
      totalJobs,
      activeJobs,
      pendingJobs,
      couponJobs,
      paidJobs,
      totalStudios,
      totalCoupons,
      whatsappClicks,
      instagramClicks,
      jobViews,
      studioViews,
      b2bConversionRate,
      abandonedRate,
      interactionsPerActiveJob,
    });
  } catch (error) {
    console.error("Error al obtener métricas:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
