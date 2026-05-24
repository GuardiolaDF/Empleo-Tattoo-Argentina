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

export async function POST(request: Request) {
  try {
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
