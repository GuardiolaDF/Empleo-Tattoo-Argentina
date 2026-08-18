import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';
import { auth } from '@/auth';
import { createJobSchema } from '@/lib/schemas';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // Solo mostramos empleos activos paginados y optimizados con lean()
    const [jobs, total] = await Promise.all([
      Job.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments({ status: 'active' })
    ]);
    
    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Job Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Rate limiter en memoria
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
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
        { error: 'Debes iniciar sesión para publicar una oferta' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();

    // 2. Validación de Esquema con Zod
    const validation = createJobSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos del anuncio inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    // 3. Crear documento sanitizado
    const safeJobData = {
      ...validation.data,
      status: 'pending', // Siempre pendiente hasta confirmación de pago por webhook
      userId: session.user.id
    };

    const job = new Job(safeJobData);
    await job.save();

    return NextResponse.json({ id: job._id }, { status: 201 });
  } catch (error) {
    console.error('Job Creation Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


