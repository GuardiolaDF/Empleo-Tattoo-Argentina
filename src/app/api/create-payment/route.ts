import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Debes iniciar sesión para realizar el pago' }, { status: 401 });
    }

    const body = await request.json();
    const jobId = body.jobId ? String(body.jobId) : '';

    if (!jobId) {
      return NextResponse.json({ error: 'ID de anuncio no proporcionado' }, { status: 400 });
    }

    await connectToDatabase();
    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 });
    }

    if (job.userId && job.userId !== session.user.id) {
      return NextResponse.json({ error: 'No tienes permiso para pagar este anuncio' }, { status: 403 });
    }

    // Obtener la URL base para los callbacks de MP
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    let baseUrl = appUrl ? (appUrl.startsWith('http') ? appUrl : `https://${appUrl}`) : '';

    if (!baseUrl) {
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const host = request.headers.get("host") || "www.empleotattoo.com.ar";
      baseUrl = `${protocol}://${host}`;
    }

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
    if (!token) {
      console.error("Token de MercadoPago no configurado");
      return NextResponse.json({ error: 'Error de configuración de pasarela de pago' }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'publicacion_eta',
            title: 'Publicación de Oferta - ETA (Lanzamiento 75% OFF)',
            unit_price: 5000,
            quantity: 1,
            currency_id: 'ARS',
          }

        ],
        back_urls: {
          success: `${baseUrl}/confirmacion`,
          failure: `${baseUrl}/confirmacion`,
          pending: `${baseUrl}/confirmacion`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        external_reference: jobId,
      }
    });

    return NextResponse.json({
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    }, { status: 200 });

  } catch (error: any) {
    console.error('MP API ERROR:', error);
    return NextResponse.json({ error: 'Falló la creación del pago', details: error.message }, { status: 500 });
  }
}

