import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Globe, ArrowLeft, AlertTriangle } from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import Convention from '@/models/Convention';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface ConventionPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ConventionPageProps): Promise<Metadata> {
  await connectToDatabase();
  const convention = await Convention.findOne({ slug: params.slug }).lean();

  if (!convention) {
    return {
      title: 'Convención no encontrada | Empleo Tattoo Argentina',
    };
  }

  const title = `${convention.title} | Empleo Tattoo Argentina`;
  const description = `Convención de tatuajes: ${convention.title}. ${new Date(convention.startDate).toLocaleDateString('es-AR')} en ${convention.city}, ${convention.province}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: convention.posterUrl ? [convention.posterUrl] : [],
    }
  };
}

export default async function ConventionDetailPage({ params }: ConventionPageProps) {
  await connectToDatabase();
  const convention = await Convention.findOne({ slug: params.slug }).lean();

  if (!convention) {
    notFound();
  }

  const isPostponed = convention.eventStatus === 'postponed';
  const isCancelled = convention.eventStatus === 'cancelled';
  const isPending = convention.publicationStatus === 'pending';

  const formatDates = (start: Date, end: Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = startDate.toLocaleDateString('es-AR', { month: 'long' }).toUpperCase();
    const year = startDate.getFullYear();
    
    if (startDay === endDay) {
      return `${startDay} DE ${month} ${year}`;
    }
    return `${startDay}—${endDay} DE ${month} ${year}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto border-t border-border flex flex-col px-4 md:px-12 lg:px-16 py-12">
        <Link href="/convenciones" className="inline-flex items-center gap-2 text-muted-foreground hover:text-black transition-colors mb-8 w-fit text-body-sm font-medium uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a cartelera</span>
        </Link>

        {isPending && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-none p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-800 font-bold">Esta publicación está pendiente de revisión</h4>
              <p className="text-yellow-700 text-sm mt-1">Solo los administradores y el creador pueden ver esta página hasta que sea aprobada.</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-border flex flex-col md:flex-row shadow-sm">
          {/* Left: Poster */}
          <div className="w-full md:w-1/2 bg-gray-50 border-b md:border-b-0 md:border-r border-border min-h-[400px] flex items-center justify-center p-4 relative">
            {convention.posterUrl && (
              <img
                src={convention.posterUrl}
                alt={convention.title}
                className={`max-w-full max-h-[800px] object-contain ${isCancelled ? 'grayscale opacity-50' : ''}`}
              />
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2 p-8 lg:p-14 flex flex-col">
            {(isPostponed || isCancelled) && (
              <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                  isCancelled ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  {isCancelled ? 'Evento Cancelado' : 'Evento Pospuesto'}
                </span>
              </div>
            )}

            <h1 className="text-display-md text-black mb-8 leading-tight">
              {convention.title}
            </h1>

            <div className="flex flex-col gap-8 text-black">
              {/* Dates */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gray-100 border border-border flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-black" />
                </div>
                <div className="pt-1">
                  <p className="text-label-sm text-muted-foreground uppercase tracking-wider mb-1">Fecha</p>
                  <p className="font-bold text-lg">{formatDates(convention.startDate, convention.endDate)}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gray-100 border border-border flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <div className="pt-1">
                  <p className="text-label-sm text-muted-foreground uppercase tracking-wider mb-1">Ubicación</p>
                  <p className="font-bold text-lg">{convention.city}, {convention.province}</p>
                  {convention.venue && <p className="text-muted-foreground mt-2">{convention.venue}</p>}
                  {convention.address && <p className="text-muted-foreground">{convention.address}</p>}
                </div>
              </div>
            </div>

            <hr className="border-border my-10" />

            {/* Links */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              {convention.instagramUrl && (
                <a 
                  href={convention.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 bg-white border border-border hover:border-black text-black py-4 px-6 font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <span>Instagram</span>
                </a>
              )}
              {convention.websiteUrl && (
                <a 
                  href={convention.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 bg-white border border-border hover:border-black text-black py-4 px-6 font-medium transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>Sitio Web</span>
                </a>
              )}
            </div>

            {/* Report Button */}
            <div className="mt-8 text-left">
              <button className="text-sm text-muted-foreground hover:text-black underline underline-offset-4 transition-colors">
                Reportar esta publicación
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
