import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongoClient';

export async function GET() {
  try {
    const client = await clientPromise;
    const dbs = ['test', 'eta_beta', 'ETAback'];
    const results: any = {};

    for (const dbName of dbs) {
      const db = client.db(dbName);
      const users = await db.collection('users').find({}).toArray();
      const jobs = await db.collection('jobs').find({}).toArray();
      const studios = await db.collection('studios').find({}).toArray();
      
      if (users.length > 0 || jobs.length > 0 || studios.length > 0) {
        results[dbName] = {
          usersCount: users.length,
          users: users.map(u => ({ id: u._id, name: u.name, email: u.email, image: u.image })),
          jobsCount: jobs.length,
          jobs: jobs.map(j => ({
            id: j._id,
            studioName: j.studioName,
            title: j.title,
            status: j.status,
            paymentId: j.paymentId,
            createdAt: j.createdAt,
            userId: j.userId
          })),
          studiosCount: studios.length,
          studios: studios.map(s => ({ id: s._id, nombre: s.nombre, userId: s.userId }))
        };
      }
    }

    return NextResponse.json({
      success: true,
      databases: results
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
