import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Optionally parse body if dynamic data is needed
    // const body = await request.json();

    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'publicacion_eta',
            title: 'Publicación ETA',
            unit_price: 20000,
            quantity: 1,
            currency_id: 'ARS',
          }
        ],
        back_urls: {
          success: 'http://localhost:3000/confirmacion',
          failure: 'http://localhost:3000/confirmacion',
          pending: 'http://localhost:3000/confirmacion',
        },
        auto_return: 'approved',
        notification_url: 'https://placeholder.ngrok.app/api/webhooks/mercadopago',
      }
    });

    return NextResponse.json({
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
