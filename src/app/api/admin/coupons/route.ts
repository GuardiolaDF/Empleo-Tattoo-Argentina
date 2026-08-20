import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

// GET: Obtener todos los cupones
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await connectToDatabase();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error al obtener cupones:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// POST: Crear nuevo cupón
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { code, discountPercent, maxUses } = await req.json();

    if (!code || typeof discountPercent !== "number" || typeof maxUses !== "number") {
      return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Verificar si ya existe
    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "Ya existe un cupón con este código" }, { status: 400 });
    }

    const newCoupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountPercent,
      maxUses,
      currentUses: 0,
      active: true,
      usedBy: []
    });

    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error) {
    console.error("Error al crear cupón:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// PUT: Activar/Desactivar o editar cupón
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id, active, maxUses, discountPercent } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    await connectToDatabase();
    const updateData: any = {};
    if (typeof active === "boolean") updateData.active = active;
    if (typeof maxUses === "number") updateData.maxUses = maxUses;
    if (typeof discountPercent === "number") updateData.discountPercent = discountPercent;

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error("Error al actualizar cupón:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// DELETE: Eliminar cupón
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
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar cupón:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
