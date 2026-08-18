import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import Coupon from '@/models/Coupon';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Ocultar los empleos de prueba viejos (ponerlos en status: 'pending')
    const realStudioNames = ['Cramertattoo.ba', 'Ghetto Tattoo', 'industriales tattoo'];
    
    // Desactivar cualquier empleo que NO esté en la lista de reales
    const hideTestJobsResult = await Job.updateMany(
      { studioName: { $nin: realStudioNames } },
      { $set: { status: 'pending' } }
    );

    // Asegurar que los empleos reales estén en status: 'active'
    const activateRealJobsResult = await Job.updateMany(
      { studioName: { $in: realStudioNames } },
      { $set: { status: 'active' } }
    );

    // 2. Limpiar/Resetear los cupones ETA100 y LANZAMIENTO100 para que los usuarios puedan usarlos libremente si tuvieron errores en el primer intento
    await Coupon.updateMany(
      { code: { $in: ['ETA100', 'LANZAMIENTO100'] } },
      { $set: { usedBy: [], currentUses: 0, active: true } }
    );

    // Buscar empleos activos finales
    const activeJobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: 'Limpieza realizada con éxito. Cupones reseteados y solo empleos reales activos.',
      activeJobsCount: activeJobs.length,
      activeJobs: activeJobs.map(j => ({ id: j._id, studio: j.studioName, title: j.title }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
