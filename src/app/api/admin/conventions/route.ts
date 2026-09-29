import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Convention from "@/models/Convention";

// GET: Obtener todas las convenciones
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectToDatabase();
    const conventions = await Convention.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(conventions);
  } catch (error) {
    console.error("Error al obtener convenciones:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// PATCH: Actualizar el publicationStatus de una convención
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { id, publicationStatus } = body;

    if (!id || !publicationStatus) {
      return NextResponse.json({ error: "ID y publicationStatus requeridos" }, { status: 400 });
    }

    await connectToDatabase();
    
    const updatedConvention = await Convention.findByIdAndUpdate(
      id, 
      { publicationStatus }, 
      { new: true }
    );
    
    return NextResponse.json(updatedConvention);
  } catch (error) {
    console.error("Error al actualizar convención:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// DELETE: Eliminar una convención por ID
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
    await Convention.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar convención:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
