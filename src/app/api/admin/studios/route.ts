import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Studio from "@/models/Studio";
import Job from "@/models/Job";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectToDatabase();
    const studios = await Studio.find().sort({ createdAt: -1 }).lean();

    // Enriquecer cada estudio con la cantidad de avisos publicados
    const studiosWithJobCounts = await Promise.all(
      studios.map(async (studio: any) => {
        const jobCount = await Job.countDocuments({ userId: studio.userId });
        return {
          ...studio,
          jobCount,
        };
      })
    );

    return NextResponse.json(studiosWithJobCounts);
  } catch (error) {
    console.error("Error al obtener estudios:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
