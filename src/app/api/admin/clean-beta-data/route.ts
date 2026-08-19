import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    const allJobs = await Job.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      totalJobs: allJobs.length,
      jobs: allJobs.map(j => ({
        id: j._id,
        studioName: j.studioName,
        title: j.title,
        status: j.status,
        paymentId: j.paymentId,
        createdAt: j.createdAt,
        userId: j.userId
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
