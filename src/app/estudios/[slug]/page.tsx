"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { SpecialtyPill } from "@/components/ui/SpecialtyPill";
import { StudioCarousel } from "@/components/ui/StudioCarousel";
import { ContactButtons } from "@/components/ui/ContactButtons";

// Duplicado local de JobCard para reutilizar las variantes sin modificar src/app/page.tsx
type JobVariant = 'white' | 'dark' | 'image' | 'gray';

interface JobCardProps {
  variant: JobVariant;
  studioName?: string;
  role: string;
  specialty: string;
  location: string;
}

function JobCard({ variant, studioName, role, specialty, location }: JobCardProps) {
  let variantClasses = "";
  let textClasses = "";
  let overlay = null;
  
  switch (variant) {
    case 'white':
      variantClasses = "bg-white";
      textClasses = "text-black";
      break;
    case 'dark':
      variantClasses = "bg-[#252525]";
      textClasses = "text-white";
      break;
    case 'image':
      variantClasses = "bg-cover bg-center relative";
      textClasses = "text-white relative z-10";
      overlay = <div className="absolute inset-0 bg-black/80 z-0"></div>;
      break;
    case 'gray':
      variantClasses = "bg-[#B5B5B5]";
      textClasses = "text-black";
      break;
  }

  const style = variant === 'image' ? { backgroundImage: "url('https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop')" } : {};

  return (
    <div className={`flex flex-col p-8 md:p-12 justify-between aspect-square md:aspect-[4/3] overflow-hidden border border-border ${variantClasses}`} style={style}>
      {overlay}
      <div className={`relative z-10 ${textClasses}`}>
        {studioName && (
          <h3 className="font-sans font-bold text-2xl md:text-3xl tracking-tight uppercase leading-none mb-6">{studioName}</h3>
        )}
        <p className="font-sans text-sm tracking-widest uppercase mb-2 opacity-90">Busca</p>
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight mb-2 leading-[1.1]">{role}</h2>
        <p className="font-sans italic text-sm tracking-widest opacity-80">{specialty}</p>
      </div>
      <div className={`relative z-10 flex items-center space-x-2 mt-8 ${textClasses}`}>
        <MapPin className="w-4 h-4" />
        <span className="font-sans text-sm tracking-wide">{location}</span>
      </div>
    </div>
  );
}

export default function PublicStudioProfilePage() {
  const router = useRouter();

  const carouselImages = [
    { src: "https://placehold.co/800x400/000000/FFFFFF?text=TRABAJO+01", alt: "Trabajo 01" },
    { src: "https://placehold.co/800x400/000000/FFFFFF?text=TRABAJO+02", alt: "Trabajo 02" },
    { src: "https://placehold.co/800x400/000000/FFFFFF?text=TRABAJO+03", alt: "Trabajo 03" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* Top Nav (No Navbar component) */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase">Volver</span>
        </button>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 space-y-24">
        
        {/* SECTION 1 - Hero */}
        <section className="w-full bg-white text-center pb-12 border-b border-border">
          <h1 className="font-serif text-6xl md:text-[7rem] tracking-tighter leading-[0.9] uppercase mb-8">
            Void Tattoo<br/>Club
          </h1>
          <p className="font-sans text-xs tracking-widest text-muted-foreground uppercase">
            EST. 2015 | Palermo, Buenos Aires
          </p>
        </section>

        {/* SECTION 2 - Studio info (2 columns) */}
        <section className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* Left Column (Wider) */}
          <div className="flex-1 space-y-16">
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Sobre el Estudio</span>
                <div className="flex-1 border-t border-border/50"></div>
              </div>
              <p className="font-sans text-sm leading-loose text-foreground/90">
                Ubicado en el corazón de Palermo, Void Tattoo Club es un espacio diseñado para la creatividad y la excelencia técnica. Fundado en 2015, nos especializamos en estilos oscuros y tradicionales, brindando un entorno privado y tranquilo tanto para nuestros artistas como para nuestros clientes. Buscamos siempre mantener un estándar internacional de higiene y calidad artística, siendo referentes en Argentina y Latinoamérica.
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-4 mb-8">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Especialidades</span>
                <div className="flex-1 border-t border-border/50"></div>
              </div>
              <div className="flex flex-wrap gap-3">
                <SpecialtyPill label="Blackwork" variant="default" />
                <SpecialtyPill label="Realismo" variant="outline" />
                <SpecialtyPill label="Tradicional" variant="default" />
                <SpecialtyPill label="Dotwork" variant="outline" />
              </div>
            </div>
          </div>

          {/* Right Column (Narrow, Sticky) */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-12 flex flex-col space-y-12">
              <ContactButtons whatsapp="5491122334455" instagram="@voidtattooclub" />
              
              <div className="w-full border-t border-border/50"></div>

              <div>
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-6 block">Ubicación del Estudio</span>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d105073.44367015509!2d-58.50333830232497!3d-34.615662456488764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca3b4ef90cbd%3A0xa0b3812e88e88e87!2sBuenos%20Aires%2C%20CABA!5e0!3m2!1ses-419!2sar!4v1714088914000!5m2!1ses-419!2sar" 
                  width="100%" 
                  height="200" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de ubicación"
                ></iframe>
              </div>
            </div>
          </aside>
        </section>

        {/* SECTION 3 - Carrusel */}
        <section className="bg-muted p-8 md:p-16 lg:p-24 -mx-4 md:-mx-8">
          <div className="flex items-center space-x-4 mb-12 max-w-7xl mx-auto w-full">
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Trabajos del Estudio</span>
            <div className="flex-1 border-t border-border/50"></div>
          </div>
          <div className="max-w-7xl mx-auto w-full">
            <StudioCarousel images={carouselImages} />
          </div>
        </section>

        {/* SECTION 4 - Active listings */}
        <section>
          <div className="flex items-center space-x-4 mb-12">
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Ofertas Activas</span>
            <div className="flex-1 border-t border-border/50"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JobCard 
              variant="white"
              studioName="Void Tattoo Club"
              role="Tatuador/a Blackwork"
              specialty="Blackwork, Dotwork"
              location="Palermo, Buenos Aires"
            />
            <JobCard 
              variant="dark"
              studioName="Void Tattoo Club"
              role="Piercer / Perforador"
              specialty="High-end Body Piercing"
              location="Palermo, Buenos Aires"
            />
          </div>
        </section>

      </main>
    </div>
  );
}
