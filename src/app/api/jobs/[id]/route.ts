import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';
import Studio from '@/models/Studio';
import { auth } from '@/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const { id: rawId } = await params;
    let targetId = rawId;
    if (rawId.length > 24) {
      const match = rawId.match(/([a-fA-F0-9]{24})$/);
      if (match) targetId = match[1];
    }

    const job = await Job.findById(targetId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    let studio = null;
    if (job.userId) {
      studio = await Studio.findOne({ userId: job.userId });
    }

    return NextResponse.json({ job, studio }, { status: 200 });
  } catch (error) {
    console.error('Job Detail Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

import { updateJobSchema } from '@/lib/schemas';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { id: jobId } = await params;
    const body = await request.json();

    const validation = updateJobSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos no válidos', details: validation.error.format() }, { status: 400 });
    }
    
    // find job and make sure it belongs to this user
    const job = await Job.findById(jobId);
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if job is older than 30 days
    const jobDate = new Date(job.createdAt);
    const diffTime = new Date().getTime() - jobDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      return NextResponse.json({ error: 'No longer editable' }, { status: 403 });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, validation.data, { new: true });
    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error('Job Detail Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


