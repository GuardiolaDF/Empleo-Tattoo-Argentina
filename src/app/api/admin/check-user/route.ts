import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Studio from '@/models/Studio';
import clientPromise from '@/lib/mongoClient';

export async function GET() {
  try {
    await connectDB();
    const client = await clientPromise;
    const db = client.db();

    // Buscar usuario por nombre o email aproximado
    const users = await db.collection('users').find({
      $or: [
        { name: { $regex: 'Andreas', $options: 'i' } },
        { name: { $regex: 'Médula', $options: 'i' } },
        { email: { $regex: 'andreas', $options: 'i' } },
        { email: { $regex: 'medula', $options: 'i' } }
      ]
    }).toArray();

    const studios = await Studio.find({
      $or: [
        { nombre: { $regex: 'Andreas', $options: 'i' } },
        { nombre: { $regex: 'Médula', $options: 'i' } }
      ]
    });

    return NextResponse.json({
      usersCount: users.length,
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email, image: u.image })),
      studiosCount: studios.length,
      studios
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
