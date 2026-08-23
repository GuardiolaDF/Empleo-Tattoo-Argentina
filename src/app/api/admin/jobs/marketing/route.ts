import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Solo traemos los campos necesarios de los anuncios activos para generar las historias
    const jobs = await Job.find({ status: "active" })
      .select("title studioName category location sharedOnInstagram createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching marketing jobs:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
