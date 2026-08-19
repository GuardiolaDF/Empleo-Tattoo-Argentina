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

    // 2. Verificar que el anuncio exista y sea del usuario autenticado
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 });
    }

    if (job.userId && job.userId !== session.user.id) {
      return NextResponse.json({ error: 'No tienes permiso sobre este anuncio' }, { status: 403 });
    }

    // Si el anuncio YA fue activado previamente con este cupón para este mismo anuncio, retornar éxito directo (Idempotencia)
    if (job.status === 'active' && (job.couponCode === cleanCode || (job.paymentId && job.paymentId.includes(cleanCode)))) {
      return NextResponse.json({
        success: true,
        isFree: true,
        message: '¡Tu anuncio ya está activo!',
        redirectUrl: '/confirmacion'
      }, { status: 200 });
    }

    // 3. Regla de Oro: Verificar si el usuario YA TIENE una publicación ACTIVA en la base de datos usando este cupón
    const activeJobWithCoupon = await Job.findOne({
      userId: session.user.id,
      status: 'active',
      _id: { $ne: jobId },
      $or: [
        { couponCode: cleanCode },
        { paymentId: { $regex: cleanCode, $options: 'i' } }
      ]
    });

    if (activeJobWithCoupon) {
      return NextResponse.json({ 
        error: `Ya utilizaste el cupón ${cleanCode} en tu anuncio activo ("${activeJobWithCoupon.studioName}"). Límite: 1 cupón por usuario.` 
      }, { status: 400 });
    }

    // 4. Verificar límite global de usos de la promoción (ej. 10 usos)
    if (coupon.currentUses >= coupon.maxUses && !coupon.usedBy.includes(session.user.id)) {
      return NextResponse.json({ error: 'Este cupón ha alcanzado el límite máximo de usos promocionales' }, { status: 400 });
    }

    // 5. Aplicación atómica en MongoDB
    const updatedCoupon = await Coupon.findOneAndUpdate(
      {
        _id: coupon._id,
        active: true
      },
      {
        $inc: { currentUses: 1 },
        $addToSet: { usedBy: session.user.id }
      },
      { returnDocument: 'after' }
    );

    // 6. Si el cupón es del 100%, activar el anuncio directamente en el modelo Job
    if (coupon.discountPercent === 100) {
      await Job.findByIdAndUpdate(jobId, {
        status: 'active',
        couponCode: cleanCode,
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
      discountPercent: coupon.discountPercent,
      message: `¡Cupón de ${coupon.discountPercent}% aplicado!`
    }, { status: 200 });

  } catch (error: any) {
    console.error('Coupon Error:', error);
    return NextResponse.json({ error: 'Error al procesar el cupón' }, { status: 500 });
  }
}
