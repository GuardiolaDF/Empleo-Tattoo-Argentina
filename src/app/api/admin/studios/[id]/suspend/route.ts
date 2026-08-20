import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Studio from '@/models/Studio';
import Job from '@/models/Job';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    await connectToDatabase();
    const studio = await Studio.findById(id);

    if (!studio) {
      return NextResponse.json({ error: 'Estudio no encontrado' }, { status: 404 });
    }

    // Toggle status
    const newStatus = studio.status === 'suspended' ? 'active' : 'suspended';
    studio.status = newStatus;
    await studio.save();

    // If suspended, set their active jobs to pending so they don't show on the board
    if (newStatus === 'suspended') {
      await Job.updateMany({ userId: studio.userId, status: 'active' }, { status: 'pending' });
    }

    return NextResponse.json({ success: true, status: newStatus }, { status: 200 });
  } catch (error) {
    console.error('Suspend Studio Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
