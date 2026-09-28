import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Convention from '@/models/Convention';
import { auth } from '@/auth';
import { createConventionSchema } from '@/lib/schemas';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-6);
}

// Rate limiter en memoria (similar a jobs)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 15;

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'próximas'; // próximas, pasadas, all
    const province = searchParams.get('province');
    // const month = searchParams.get('month'); // For future
    // const year = searchParams.get('year');   // For future

    const query: any = { publicationStatus: 'published' };

    if (province) {
      query.province = province;
    }

    const now = new Date();

    if (status === 'próximas') {
      query.endDate = { $gte: now };
    } else if (status === 'pasadas') {
      query.endDate = { $lt: now };
    }

    const sortOption: any = status === 'pasadas' ? { startDate: -1 } : { startDate: 1 };

    const conventions = await Convention.find(query)
      .sort(sortOption)
      .lean();
    
    return NextResponse.json({ conventions }, { status: 200 });
  } catch (error) {
    console.error('Convention Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    
    if (rateLimit.size > 1000) {
      rateLimit.forEach((val, key) => {
        if (val.timestamp < windowStart) rateLimit.delete(key);
      });
    }

    const currentRate = rateLimit.get(ip) || { count: 0, timestamp: now };
    
    if (currentRate.timestamp < windowStart) {
      currentRate.count = 0;
      currentRate.timestamp = now;
    }

    currentRate.count++;
    rateLimit.set(ip, currentRate);

    if (currentRate.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor reintenta en un minuto.' },
        { status: 429 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para publicar una convención' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();

    // 2. Validación de Esquema con Zod
    const validation = createConventionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de la convención inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    // 3. Crear documento sanitizado
    const slug = generateSlug(validation.data.title);
    
    const safeData = {
      ...validation.data,
      slug,
      publicationStatus: 'pending', 
      eventStatus: 'scheduled',
      userId: session.user.id
    };

    const convention = new Convention(safeData);
    await convention.save();

    return NextResponse.json({ id: convention._id, slug: convention.slug }, { status: 201 });
  } catch (error) {
    console.error('Convention Creation Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
