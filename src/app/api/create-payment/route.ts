import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const jobId = body.jobId ? String(body.jobId) : 'no_id_provided';
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
    console.log("Token detectado:", !!token);
    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'publicacion_eta',
            title: 'Publicación de Oferta - ETA',
            unit_price: 20000,
            quantity: 1,
            currency_id: 'ARS',
          }
        ],
        back_urls: {
          success: 'https://drainage-unburned-headlock.ngrok-free.dev/confirmacion',
          failure: 'https://drainage-unburned-headlock.ngrok-free.dev/confirmacion',
          pending: 'https://drainage-unburned-headlock.ngrok-free.dev/confirmacion',
        },
        auto_return: 'approved',
        notification_url: 'https://drainage-unburned-headlock.ngrok-free.dev/api/webhooks/mercadopago',
        external_reference: jobId,
      }
    });

    return NextResponse.json({
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    }, { status: 200 });

  } catch (error: any) {
    console.error('MP API ERROR:', error);
    return NextResponse.json({ error: 'Payment creation failed', details: error.message }, { status: 500 });
  }
}
