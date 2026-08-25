import { NextResponse, after } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Studio from '@/models/Studio';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    await connectToDatabase();
    const studio = await Studio.findOne({ userId: session.user.id });

    if (!studio) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(studio, { status: 200 });
  } catch (error) {
    console.error('Studio GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function getSafeStudioData(body: any) {
  const { nombre, anio, ubicacion, bio, instagram, whatsapp, countryCode, website, especialidades, fotos, portada } = body || {};
  return {
    ...(nombre !== undefined && { nombre: String(nombre) }),
    ...(anio !== undefined && { anio: String(anio) }),
    ...(ubicacion !== undefined && { ubicacion: String(ubicacion) }),
    ...(bio !== undefined && { bio: String(bio) }),
    ...(instagram !== undefined && { instagram: String(instagram) }),
    ...(whatsapp !== undefined && { whatsapp: String(whatsapp) }),
    ...(countryCode !== undefined && { countryCode: String(countryCode) }),
    ...(website !== undefined && { website: String(website) }),
    ...(Array.isArray(especialidades) && { especialidades: especialidades.map(String) }),
    ...(Array.isArray(fotos) && { fotos: fotos.map(String) }),
    ...(portada !== undefined && { portada: String(portada) }),
  };
}

import { studioSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const validation = studioSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Datos del estudio no válidos', details: validation.error.format() }, { status: 400 });
    }

    const safeData = validation.data;

    // Check if studio already exists for this user
    const existing = await Studio.findOne({ userId: session.user.id });
    if (existing) {
      const oldFotos = existing.fotos || [];
      const newFotos = safeData.fotos || [];
      
      const orphanedFotos = oldFotos.filter((url: string) => !newFotos.includes(url));

      // Update instead
      const updated = await Studio.findOneAndUpdate(
        { userId: session.user.id },
        { ...safeData, userId: session.user.id },
        { returnDocument: 'after' }
      );
      
      if (updated && orphanedFotos.length > 0) {
        after(async () => {
          try {
            for (const url of orphanedFotos) {
              if (url.includes('cloudinary')) {
                const publicId = url.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
              }
            }
          } catch (err) {
            console.error('Error cleaning up orphaned photos:', err);
          }
        });
      }

      return NextResponse.json(updated, { status: 200 });
    }

    const studio = new Studio({ ...safeData, userId: session.user.id });
    await studio.save();

    return NextResponse.json(studio, { status: 201 });
  } catch (error) {
    console.error('Studio POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const validation = studioSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Datos del estudio no válidos', details: validation.error.format() }, { status: 400 });
    }

    const existing = await Studio.findOne({ userId: session.user.id });
    if (!existing) {
      return NextResponse.json({ error: 'Estudio no encontrado' }, { status: 404 });
    }

    const oldFotos = existing.fotos || [];
    const newFotos = validation.data.fotos || oldFotos; // Fallback to old if not updated
    const orphanedFotos = validation.data.fotos ? oldFotos.filter((url: string) => !newFotos.includes(url)) : [];

    const updated = await Studio.findOneAndUpdate(
      { userId: session.user.id },
      validation.data,
      { returnDocument: 'after' }
    );

    if (updated && orphanedFotos.length > 0) {
      after(async () => {
        try {
          for (const url of orphanedFotos) {
            if (url.includes('cloudinary')) {
              const publicId = url.split('/').slice(-2).join('/').split('.')[0];
              await cloudinary.uploader.destroy(publicId);
            }
          }
        } catch (err) {
          console.error('Error cleaning up orphaned photos in PUT:', err);
        }
      });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Studio PUT Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


