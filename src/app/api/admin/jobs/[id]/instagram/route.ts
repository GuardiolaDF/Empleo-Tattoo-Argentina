import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { sharedOnInstagram } = await request.json();

    await connectToDatabase();
    
    const job = await Job.findByIdAndUpdate(
      id,
      { sharedOnInstagram },
      { new: true }
    );

    if (!job) {
      return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Error updating instagram status:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
