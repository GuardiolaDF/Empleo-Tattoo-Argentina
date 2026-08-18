import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import Coupon from '@/models/Coupon';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Nombres de estudios reales de hoy
    const realStudioKeywords = ['cramer', 'ghetto', 'industriales', 'ink & concrete'];
    
    // Buscar todos los empleos
    const allJobs = await Job.find({});
    
    for (const job of allJobs) {
      const isReal = realStudioKeywords.some(kw => 
        job.studioName?.toLowerCase().includes(kw) || 
        job.title?.toLowerCase().includes(kw)
      );

      if (isReal) {
        await Job.findByIdAndUpdate(job._id, { status: 'active' });
      } else {
        await Job.findByIdAndUpdate(job._id, { status: 'pending' });
      }
    }

    // 2. Resetear el historial de uso de cupones para permitir que los usuarios vuelvan a publicar si tuvieron errores
    await Coupon.updateMany(
      { code: { $in: ['ETA100', 'LANZAMIENTO100'] } },
      { $set: { usedBy: [], currentUses: 0, active: true } }
    );

    const activeJobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: 'Base de datos limpia. Cupones habilitados nuevamente y solo anuncios reales visibles.',
      activeCount: activeJobs.length,
      activeJobs: activeJobs.map(j => ({ id: j._id, studio: j.studioName, title: j.title }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
