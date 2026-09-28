import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Convention from '@/models/Convention';
import { auth } from '@/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectToDatabase();
    
    const conventions = await Convention.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(conventions, { status: 200 });
  } catch (error) {
    console.error('My Conventions Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
