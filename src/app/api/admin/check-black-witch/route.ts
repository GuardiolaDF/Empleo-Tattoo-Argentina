import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import clientPromise from '@/lib/mongoClient';

export async function GET() {
  try {
    await connectDB();
    const client = await clientPromise;
    const db = client.db();

    // Buscar usuarios con "Black" o "Witch"
    const users = await db.collection('users').find({
      $or: [
        { name: { $regex: 'Black', $options: 'i' } },
        { name: { $regex: 'Witch', $options: 'i' } },
        { email: { $regex: 'black', $options: 'i' } },
        { email: { $regex: 'witch', $options: 'i' } }
      ]
    }).toArray();

    // Buscar empleos con "Black" o "Witch" en studioName o title
    const jobs = await Job.find({
      $or: [
        { studioName: { $regex: 'Black', $options: 'i' } },
        { studioName: { $regex: 'Witch', $options: 'i' } },
        { title: { $regex: 'Black', $options: 'i' } },
        { title: { $regex: 'Witch', $options: 'i' } }
      ]
    });

    // Buscar empleos recientes en status pending o active
    const recentJobs = await Job.find({}).sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({
      users,
      jobs,
      recentJobs: recentJobs.map(j => ({
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
