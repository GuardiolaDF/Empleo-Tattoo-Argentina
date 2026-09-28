import React from 'react';
import Link from 'next/link';
import ConventionCard from '@/components/ui/ConventionCard';
import ConventionFilters from '@/components/ui/ConventionFilters';
import connectToDatabase from '@/lib/mongodb';
import Convention from '@/models/Convention';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface ConventionsPageProps {
  searchParams: Promise<{ status?: string; province?: string }>;
}

export const revalidate = 60; // Revalidate at most every 60 seconds

export default async function ConventionsPage(props: ConventionsPageProps) {
  const searchParams = await props.searchParams;
  await connectToDatabase();
  
  const status = searchParams.status || 'próximas';
  const province = searchParams.province;
  const now = new Date();

  const query: any = { publicationStatus: 'published' };
  if (province) {
    query.province = province;
  }
  if (status === 'próximas') {
    query.endDate = { $gte: now };
  } else if (status === 'pasadas') {
    query.endDate = { $lt: now };
  }

  const sortOption: any = status === 'pasadas' ? { startDate: -1 } : { startDate: 1 };
  const conventions = await Convention.find(query).sort(sortOption).lean();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto border-t border-border flex flex-col">
        {/* Hero Header */}
        <section className="px-8 md:px-12 lg:px-16 py-16 md:py-24 border-b border-border bg-white">
          <div className="max-w-3xl">
            <h1 className="text-display-xl mb-6">Convenciones</h1>
            <p className="text-body text-muted-foreground mb-10 leading-relaxed">
              La cartelera definitiva de eventos y convenciones de tatuajes en Argentina. 
              Encuentra dónde serán los próximos encuentros, planifica tu asistencia o publica el evento de tu estudio para convocar a los mejores artistas.
            </p>
            <Link 
              href="/convenciones/nueva"
              className="inline-flex items-center justify-center px-10 py-4 bg-black text-white font-medium text-button hover:bg-black/90 transition-colors"
            >
              Publicar Convención (Gratis)
            </Link>
          </div>
        </section>

        {/* Content Section */}
        <section className="flex-1 px-8 md:px-12 lg:px-16 py-12">
          {/* Tabs & Filters */}
          <ConventionFilters status={status} province={province} />

          {/* Grid */}
          {conventions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {conventions.map((conv: any) => (
                <ConventionCard key={conv._id.toString()} convention={conv} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-border p-16 flex flex-col items-center justify-center text-center">
              <h3 className="text-h3 mb-4">Sin resultados</h3>
              <p className="text-body-sm text-muted-foreground max-w-sm">
                {province 
                  ? `Por el momento no hay convenciones ${status} publicadas en ${province}.` 
                  : `Por el momento no hay convenciones ${status} publicadas en la cartelera.`}
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
