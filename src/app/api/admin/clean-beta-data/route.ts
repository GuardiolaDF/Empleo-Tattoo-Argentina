import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Obtener todos los empleos activos o creados recientemente
    const allJobs = await Job.find({}).sort({ createdAt: -1 });

    const seenStudios = new Set<string>();

    // Mantener solo la publicación más reciente de cada estudio
    for (const job of allJobs) {
      const normalizedName = job.studioName.trim().toLowerCase();
      
      // Filtramos únicamente los estudios reales de la beta
      const isRealBetaStudio = ['cramertattoo.ba', 'ghetto tattoo', 'industriales tattoo'].includes(normalizedName);

      if (isRealBetaStudio && !seenStudios.has(normalizedName)) {
        seenStudios.add(normalizedName);
        await Job.findByIdAndUpdate(job._id, { status: 'active' });
      } else {
        await Job.findByIdAndUpdate(job._id, { status: 'pending' });
      }
    }

    const finalActiveJobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: 'Desduplicación realizada. Se conservó 1 sola publicación activa por estudio.',
      activeCount: finalActiveJobs.length,
      activeJobs: finalActiveJobs.map(j => ({ id: j._id, studio: j.studioName, title: j.title }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
