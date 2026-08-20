import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";
import Studio from "@/models/Studio";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectToDatabase();
    const pendingJobs = await Job.find({ status: "pending" }).sort({ createdAt: -1 }).lean();

    // Enriquecer con información del estudio (si existe)
    const enrichedJobs = await Promise.all(
      pendingJobs.map(async (job: any) => {
        let studioInfo = null;
        if (job.userId) {
          studioInfo = await Studio.findOne({ userId: job.userId }).lean();
        }
        return {
          ...job,
          studioInfo,
        };
      })
    );

    return NextResponse.json(enrichedJobs);
  } catch (error) {
    console.error("Error al obtener publicaciones abandonadas:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
