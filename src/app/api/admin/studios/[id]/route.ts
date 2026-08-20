import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Studio from '@/models/Studio';
import Job from '@/models/Job';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    await connectToDatabase();
    
    // Find studio first to get its userId so we can delete its jobs
    const studio = await Studio.findById(id);
    if (!studio) {
      return NextResponse.json({ error: 'Estudio no encontrado' }, { status: 404 });
    }

    // Delete all jobs associated with this studio
    await Job.deleteMany({ userId: studio.userId });
    
    // Delete the studio itself
    await Studio.findByIdAndDelete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete Studio Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
