import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'payment') {
      console.log('Received payment update from Mercado Pago! Payment ID:', data?.id);
    }

    // Critical: Return a 200 OK immediately
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    // Always return 200 to prevent MP from retrying infinitely on our parsing errors
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
