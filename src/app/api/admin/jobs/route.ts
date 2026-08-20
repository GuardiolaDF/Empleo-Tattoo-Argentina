import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";

// GET: Obtener todos los avisos
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectToDatabase();
    const jobs = await Job.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error al obtener avisos:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// PUT: Actualizar estado o datos de un aviso
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, title, studioName, location, category } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    await connectToDatabase();
    const updateData: any = {};
    if (status) updateData.status = status;
    if (title) updateData.title = title;
    if (studioName) updateData.studioName = studioName;
    if (location) updateData.location = location;
    if (category) updateData.category = category;

    const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Error al actualizar aviso:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// DELETE: Eliminar un aviso por ID
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    await connectToDatabase();
    await Job.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar aviso:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
