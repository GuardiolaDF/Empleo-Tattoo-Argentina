import { Resend } from 'resend';
import WelcomeEmail from '@/emails/WelcomeEmail';
import JobConfirmationEmail from '@/emails/JobConfirmationEmail';

// Asegurate de poner tu API Key de Resend en el archivo .env o en las variables de Vercel
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

// En la capa gratuita de Resend, el remitente debe ser onboarding@resend.dev
// y el destinatario debe ser el correo electrónico registrado en tu cuenta de Resend.
// Cuando conectes tu dominio real, cambiarás esto a info@tudominio.com.ar
const FROM_EMAIL = 'onboarding@resend.dev';

export async function sendWelcomeEmail(to: string, studioName: string) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Bienvenido a Empleo Tattoo Argentina',
      react: WelcomeEmail({ studioName }),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend Error (Welcome):", error);
    return { success: false, error };
  }
}

export async function sendJobConfirmationEmail(to: string, studioName: string, jobTitle: string, jobId: string) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Tu búsqueda laboral está activa - ETA',
      react: JobConfirmationEmail({ studioName, jobTitle, jobId }),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend Error (Job Confirm):", error);
    return { success: false, error };
  }
}
