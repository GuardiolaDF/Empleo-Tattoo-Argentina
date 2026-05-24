import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';
import { auth } from '@/auth';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Solo mostramos los empleos activos, ordenados por los más recientes
    const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });
    
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('Job Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Simple in-memory rate limiter (LRU Cache style)
// Note: In Vercel Edge/Serverless this resets on cold starts, which is fine for basic protection
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    
    // Cleanup old entries (primitive garbage collection)
    if (rateLimit.size > 1000) {
      rateLimit.forEach((val, key) => {
        if (val.timestamp < windowStart) rateLimit.delete(key);
      });
    }

    const currentRate = rateLimit.get(ip) || { count: 0, timestamp: now };
    
    // Reset window if needed
    if (currentRate.timestamp < windowStart) {
      currentRate.count = 0;
      currentRate.timestamp = now;
    }

    currentRate.count++;
    rateLimit.set(ip, currentRate);

    if (currentRate.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const session = await auth();
    // No exigimos auth estricto para evitar romper la UI si prueban sin login,
    // pero guardamos el userId si existe
    const userId = session?.user?.id;

    // Establecer la conexión a la BD
    await connectToDatabase();

    // Parsear el body de la petición
    const body = await request.json();

    // Instanciar un nuevo documento Job y guardarlo
    const jobData = userId ? { ...body, userId } : body;
    const job = new Job(jobData);
    await job.save();

    // Retornar 201 Created con el ID insertado
    return NextResponse.json({ id: job._id }, { status: 201 });
  } catch (error) {
    console.error('Job Creation Error:', error);
    // Retornar HTTP 500 en caso de fallo
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
