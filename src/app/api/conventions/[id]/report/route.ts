import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Convention from '@/models/Convention';
import { auth } from '@/auth';

export async function POST(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Debes iniciar sesión para reportar una convención' }, { status: 401 });
    }

    await connectToDatabase();
    const convention = await Convention.findById(id);

    if (!convention) {
      return NextResponse.json({ error: 'Convención no encontrada' }, { status: 404 });
    }

    const body = await request.json();
    const { reason, details } = body;

    const allowedReasons = ['false_information', 'cancelled_event', 'inappropriate_content', 'spam', 'other'];

    if (!allowedReasons.includes(reason)) {
      return NextResponse.json({ error: 'Motivo de reporte inválido' }, { status: 400 });
    }

    // TODO: Posteriormente almacenar en un modelo `ConventionReport`
    // Por ahora lo logueamos en la consola del servidor (que se registra en Vercel logs)
    console.log(`[REPORT] Convention ${id} reported by user ${session.user.id}. Reason: ${reason}. Details: ${details}`);

    return NextResponse.json({ message: 'Reporte enviado con éxito' }, { status: 201 });
  } catch (error) {
    console.error('Convention Report Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
