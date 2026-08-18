import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    
    // Activar cualquier anuncio pendiente en la base de datos
    const result = await Job.updateMany(
      { status: 'pending' },
      { $set: { status: 'active', paymentId: 'AUTO_ACTIVATED_BETA' } }
    );

    return NextResponse.json({
      success: true,
      message: `Se activaron ${result.modifiedCount} anuncios pendientes exitosamente.`,
      modifiedCount: result.modifiedCount
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
