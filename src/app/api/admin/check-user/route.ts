import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import clientPromise from '@/lib/mongoClient';

export async function GET() {
  try {
    await connectDB();
    const client = await clientPromise;
    const db = client.db();

    // List all collections in current database
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // Fetch all jobs using Mongoose
    const mongooseJobs = await Job.find({}).sort({ createdAt: -1 });

    // Fetch raw jobs collection directly
    const rawJobs = await db.collection('jobs').find({}).toArray();
    const rawUsers = await db.collection('users').find({}).toArray();

    return NextResponse.json({
      dbName: db.databaseName,
      collections: collectionNames,
      mongooseJobsCount: mongooseJobs.length,
      mongooseJobs,
      rawJobsCount: rawJobs.length,
      rawJobs,
      rawUsersCount: rawUsers.length,
      rawUsers
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
