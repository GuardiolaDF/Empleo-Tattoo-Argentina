import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Studio from '@/models/Studio';
import Job from '@/models/Job';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const studio = await Studio.findById(id);
    if (!studio) {
      return NextResponse.json({ error: 'Estudio no encontrado' }, { status: 404 });
    }

    // Also fetch active jobs for this studio
    const jobs = await Job.find({ userId: studio.userId, status: 'active' }).sort({ createdAt: -1 });

    return NextResponse.json({
      studio,
      jobs,
    }, { status: 200 });
  } catch (error) {
    console.error('Public Studio GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
