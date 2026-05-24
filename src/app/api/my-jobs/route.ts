import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    await connectToDatabase();
    const jobs = await Job.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('My Jobs Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
