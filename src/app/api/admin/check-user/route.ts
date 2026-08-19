import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import clientPromise from '@/lib/mongoClient';

export async function GET() {
  try {
    await connectDB();
    const client = await clientPromise;
    const db = client.db();

    const allUsers = await db.collection('users').find({}).toArray();
    const allJobs = await Job.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      usersCount: allUsers.length,
      users: allUsers.map(u => ({ id: u._id, name: u.name, email: u.email, image: u.image })),
      jobsCount: allJobs.length,
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
