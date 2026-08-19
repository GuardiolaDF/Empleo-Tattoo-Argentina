import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    
    // IDs específicos de las publicaciones duplicadas de Cramer Tattoo
    const duplicateIds = ['6a84f0377816316fd8a11403', '6a84edd702b1ed938405460a'];
    
    await Job.updateMany(
      { _id: { $in: duplicateIds } },
      { $set: { status: 'pending' } }
    );

    const finalActiveJobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: 'Publicaciones duplicadas eliminadas con éxito. Quedó 1 sola activa.',
      activeJobsCount: finalActiveJobs.length,
      activeJobs: finalActiveJobs.map(j => ({ id: j._id, studio: j.studioName, title: j.title }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
