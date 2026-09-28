import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Convention from '@/models/Convention';
import { auth } from '@/auth';
import { updateConventionSchema } from '@/lib/schemas';

// Helper for dynamic route params in Next.js App Router
type Context = { params: { id: string } };

export async function GET(request: Request, context: any) {
  try {
    const { id } = context.params;
    await connectToDatabase();
    
    // We check if it's a valid ID or if we should find by slug. 
    // We will assume ID is passed for dashboard editing, and slug for public view if needed.
    // However, public view usually fetches by slug from a different API or direct DB call.
    // Here we find by ID.
    const convention = await Convention.findById(id).lean();
    if (!convention) {
      return NextResponse.json({ error: 'Convención no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ convention }, { status: 200 });
  } catch (error) {
    console.error('Convention Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const { id } = context.params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectToDatabase();
    const convention = await Convention.findById(id);

    if (!convention) {
      return NextResponse.json({ error: 'Convención no encontrada' }, { status: 404 });
    }

    // Autorización
    if (convention.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Prohibido: no eres el propietario de esta convención' }, { status: 403 });
    }

    const body = await request.json();

    // Podemos aceptar cambios en eventStatus además de los datos del esquema
    // pero no en publicationStatus (solo admin puede publicarlo si estaba pendiente)
    const { eventStatus, ...dataToValidate } = body;

    const validation = updateConventionSchema.safeParse(dataToValidate);
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: validation.error.format() }, { status: 400 });
    }

    if (eventStatus && ['scheduled', 'postponed', 'cancelled'].includes(eventStatus)) {
      convention.eventStatus = eventStatus;
    }

    Object.assign(convention, validation.data);
    await convention.save();

    return NextResponse.json({ message: 'Convención actualizada', id: convention._id }, { status: 200 });
  } catch (error) {
    console.error('Convention Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = context.params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectToDatabase();
    const convention = await Convention.findById(id);

    if (!convention) {
      return NextResponse.json({ error: 'Convención no encontrada' }, { status: 404 });
    }

    if (convention.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    await convention.deleteOne();
    return NextResponse.json({ message: 'Convención eliminada' }, { status: 200 });
  } catch (error) {
    console.error('Convention Delete Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
