import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (!existing) {
      // Save to database
      const subscriber = new Subscriber({ email });
      await subscriber.save();
      
      // Send welcome email via Resend
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: '¡Bienvenido a Empleo Tattoo Argentina!',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h1 style="color: #000; text-transform: uppercase;">¡Bienvenido a ETA!</h1>
            <p>Gracias por suscribirte a nuestro newsletter. A partir de ahora recibirás en tu correo las últimas ofertas de empleo para tatuadores y perforadores, así como novedades exclusivas de la comunidad.</p>
            <p>Si eres un estudio, no olvides que puedes <a href="https://empleotattoo.com/publicar-empleo" style="color: #000; font-weight: bold;">Publicar un Aviso</a> en cualquier momento.</p>
            <br />
            <p>Saludos,<br />El equipo de Empleo Tattoo Argentina.</p>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Newsletter Error:', error);
    // Even if it fails due to duplicate email in mongoose, we can return success to the user 
    // to not leak subscriber information, or we can handle it gracefully.
    if (error.code === 11000) {
      return NextResponse.json({ success: true }, { status: 200 }); // Already subscribed
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
