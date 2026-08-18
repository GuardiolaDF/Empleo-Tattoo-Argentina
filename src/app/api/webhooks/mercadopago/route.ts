import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';
import Subscriber from '@/models/Subscriber';
import { Resend } from 'resend';
import crypto from 'crypto';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' });
const resend = new Resend(process.env.RESEND_API_KEY);
const WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET || '';

async function processPayment(paymentId: string) {
  try {
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    if (paymentData.status === 'approved' && paymentData.external_reference) {
      await connectToDatabase();
      const updatedJob = await Job.findByIdAndUpdate(
        paymentData.external_reference,
        { status: 'active', paymentId: paymentId },
        { returnDocument: 'after' }
      );
      console.log(`Job ${paymentData.external_reference} activated successfully. MP ID: ${paymentId}`);

      // Automated Mass Email
      if (updatedJob) {
        try {
          const subscribers = await Subscriber.find({ active: true });
          if (subscribers.length > 0) {
            const emails = subscribers.map((sub: any) => ({
              from: 'notificaciones@resend.dev', // Cambiar por tu dominio verificado en Resend en producción
              to: sub.email,
              subject: `¡Nuevo Empleo en ETA! ${updatedJob.title} en ${updatedJob.studioName}`,
              html: `
                <div style="font-family: sans-serif; padding: 20px;">
                  <h1 style="color: #000; text-transform: uppercase;">Nuevo Aviso Publicado</h1>
                  <p><strong>${updatedJob.studioName}</strong> está buscando un/a <strong>${updatedJob.title}</strong> en <strong>${updatedJob.location}</strong>.</p>
                  <p>Especialidad buscada: ${updatedJob.category}</p>
                  <br />
                  <a href="https://empleotattoo.com" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold;">Ver Oferta en el Feed</a>
                  <br /><br />
                  <p style="font-size: 12px; color: #666;">Recibes este correo porque te suscribiste al newsletter de Empleo Tattoo Argentina.</p>
                </div>
              `
            }));
            
            // Send in batches (Resend limit is 100 per batch call)
            // For MVP, we send the first 100. For scale, you'd loop over chunks of 100.
            await resend.batch.send(emails.slice(0, 100));
            console.log(`Sent mass email to ${Math.min(subscribers.length, 100)} subscribers.`);
          }
        } catch (emailError) {
          console.error("Error sending automated emails:", emailError);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing payment ${paymentId} in background:`, error);
  }
}

export async function POST(request: Request) {
  try {
    const signatureHeader = request.headers.get('x-signature');
    const requestId = request.headers.get('x-request-id');
    const bodyText = await request.text(); // Wait for raw text to validate HMAC
    
    console.log('--- Webhook Received from Mercado Pago ---');

    // HMAC SHA256 Validation
    if (WEBHOOK_SECRET) {
      if (!signatureHeader || !requestId) {
        console.error("Webhook rejected: missing signature or request-id headers.");
        return new NextResponse("Unauthorized - Missing Signature Headers", { status: 401 });
      }

      const parts = signatureHeader.split(',');
      let ts = '';
      let v1 = '';
      
      parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key.trim() === 'ts') ts = value.trim();
        if (key.trim() === 'v1') v1 = value.trim();
      });

      const manifest = `id:${requestId};request-id:${requestId};ts:${ts};`;
      const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
      hmac.update(manifest);
      const computedHash = hmac.digest('hex');

      if (computedHash !== v1) {
        console.error("Webhook signature validation failed! Rejecting request.");
        return new NextResponse("Unauthorized - Invalid Signature", { status: 401 });
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        console.error("CRITICAL: MercadoPago WEBHOOK_SECRET is missing in production! Rejecting request for security.");
        return new NextResponse("Unauthorized - Server Configuration Error", { status: 401 });
      }
      console.warn("MercadoPago webhook secret not configured. Running in unverified dev mode.");
    }


    const body = JSON.parse(bodyText);
    const { type, data, action } = body;

    if (type === 'payment' || action === 'payment.created' || action === 'payment.updated') {
      const paymentId = data?.id;
      if (paymentId) {
        await processPayment(paymentId);
      }
    }

    // Critical: Return a 200 OK immediately
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    // Always return 200 to prevent MP from retrying infinitely on our parsing errors
    return NextResponse.json({ status: "success" }, { status: 200 });
  }
}
