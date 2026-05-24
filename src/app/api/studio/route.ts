import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Studio from '@/models/Studio';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    await connectToDatabase();
    const studio = await Studio.findOne({ userId: session.user.id });

    if (!studio) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(studio, { status: 200 });
  } catch (error) {
    console.error('Studio GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    // Check if studio already exists for this user
    const existing = await Studio.findOne({ userId: session.user.id });
    if (existing) {
      // Update instead
      const updated = await Studio.findOneAndUpdate(
        { userId: session.user.id },
        { ...body, userId: session.user.id },
        { returnDocument: 'after' }
      );
      return NextResponse.json(updated, { status: 200 });
    }

    const studio = new Studio({ ...body, userId: session.user.id });
    await studio.save();

    return NextResponse.json(studio, { status: 201 });
  } catch (error) {
    console.error('Studio POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    const updated = await Studio.findOneAndUpdate(
      { userId: session.user.id },
      body,
      { returnDocument: 'after' }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Estudio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Studio PUT Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
