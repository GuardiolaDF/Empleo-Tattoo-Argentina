import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';
import Coupon from '@/models/Coupon';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Debes iniciar sesión para aplicar un cupón' }, { status: 401 });
    }

    const { code, jobId } = await request.json();

    if (!code || !jobId) {
      return NextResponse.json({ error: 'Código de cupón e ID de anuncio requeridos' }, { status: 400 });
    }

    const cleanCode = String(code).trim().toUpperCase();

    await connectToDatabase();

    // 1. Sembrar cupón de lanzamiento inicial si no existe ninguno
    let coupon = await Coupon.findOne({ code: cleanCode });
    
    // Si la base de datos está limpia y el usuario intenta usar ETA100 o LANZAMIENTO100, creamos el cupón automáticamente de forma segura
    if (!coupon && (cleanCode === 'ETA100' || cleanCode === 'LANZAMIENTO100')) {
      coupon = new Coupon({
        code: cleanCode,
        discountPercent: 100,
        maxUses: 10,
        currentUses: 0,
        active: true,
        usedBy: []
      });
      await coupon.save();
    }

    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: 'Código de cupón inválido o inactivo' }, { status: 404 });
    }

    if (coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ error: 'Este cupón ha alcanzado el límite máximo de 10 usos' }, { status: 400 });
    }

    // Verificar si este usuario ya utilizó un cupón anteriormente (Límite 1 por cuenta registrada)
    const userAlreadyUsed = await Coupon.findOne({ usedBy: session.user.id });
    if (userAlreadyUsed) {
      return NextResponse.json({ error: 'Ya has utilizado un cupón de descuento en tu cuenta. Límite: 1 cupón por usuario.' }, { status: 400 });
    }


    // 2. Verificar que el anuncio exista y sea del usuario autenticado
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 });
    }

    if (job.userId && job.userId !== session.user.id) {
      return NextResponse.json({ error: 'No tienes permiso sobre este anuncio' }, { status: 403 });
    }

    // 3. Aplicación atómica en MongoDB (Previene condiciones de carrera o sobrepaso de límite)
    const updatedCoupon = await Coupon.findOneAndUpdate(
      {
        _id: coupon._id,
        active: true,
        $expr: { $lt: ["$currentUses", "$maxUses"] }
      },
      {
        $inc: { currentUses: 1 },
        $push: { usedBy: session.user.id }
      },
      { returnDocument: 'after' }
    );

    if (!updatedCoupon) {
      return NextResponse.json({ error: 'El cupón se ha agotado justo ahora' }, { status: 400 });
    }

    // 4. Si el cupón es del 100%, activar el anuncio directamente sin ir a MercadoPago
    if (updatedCoupon.discountPercent === 100) {
      await Job.findByIdAndUpdate(jobId, {
        status: 'active',
        paymentId: `CUPON_${cleanCode}_${Date.now()}`
      });

      return NextResponse.json({
        success: true,
        isFree: true,
        message: '¡Cupón del 100% aplicado con éxito! Tu aviso ya está activo.',
        redirectUrl: '/confirmacion'
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      isFree: false,
      discountPercent: updatedCoupon.discountPercent,
      message: `¡Cupón de ${updatedCoupon.discountPercent}% aplicado!`
    }, { status: 200 });

  } catch (error: any) {
    console.error('Coupon Error:', error);
    return NextResponse.json({ error: 'Error al procesar el cupón' }, { status: 500 });
  }
}
