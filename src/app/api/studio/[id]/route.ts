import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Studio from '@/models/Studio';
import Job from '@/models/Job';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    let targetId = rawId;
    if (rawId.length > 24) {
      const match = rawId.match(/([a-fA-F0-9]{24})$/);
      if (match) targetId = match[1];
    }
    await connectToDatabase();

    const studio = await Studio.findById(targetId);
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
