"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Store, MessageCircle, ExternalLink, X } from "lucide-react";
import Link from "next/link";

export default function JobListingPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [job, setJob] = useState<any>(null);
  const [studio, setStudio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!slug) return;
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data.job);
          setStudio(data.studio);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-body text-muted-foreground">Cargando aviso...</p>
      </div>
    );
  }

  if (!job) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": `${job.title} ${job.category}`,
    "description": `Buscamos un ${job.title?.toLowerCase()} especializado en ${job.category} para unirse a nuestro estudio ubicado en ${job.location}.`,
    "datePosted": job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": studio?.nombre || job.studioName,
      "sameAs": studio?.instagram ? `https://instagram.com/${studio.instagram.replace('@','')}` : undefined,
      "logo": studio?.portada || undefined
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
        "addressCountry": "AR"
      }
    }
  };

  // Parses basic description
  const descriptionParts = job.description?.split('|') || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-16 flex flex-col lg:flex-row gap-16 lg:gap-32">
        
        {/* Left Column (Main Content) */}
        <div className="flex-1">
          <button onClick={() => router.back()} className="inline-flex items-center space-x-2 text-muted-foreground hover:text-black transition-colors mb-16">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-nav">Volver</span>
          </button>

          <h1 className="text-display-xl mb-12 uppercase leading-[0.9]">
            {job.title} <br/> {job.category}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            {studio ? (
              <Link href={`/estudios/${studio._id}`} className="text-nav underline hover:text-muted-foreground transition-colors">
                {studio.nombre}
              </Link>
            ) : (
              <span className="text-nav">{job.studioName}</span>
            )}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-12 py-5 text-button hover:bg-black/90 transition-colors"
            >
              Postularse
            </button>
          </div>

          <div className="w-full border-t border-border mb-12"></div>

          {/* Content Card */}
          <div className="bg-white border border-border p-8 md:p-16 space-y-16">
            
            {/* Descripción */}
            <section>
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-label-sm text-muted-foreground">Descripción</span>
                <div className="flex-1 border-t border-border/50"></div>
              </div>
              <p className="text-body text-foreground/90 leading-loose">
                Buscamos un {job.title.toLowerCase()} especializado en {job.category} para unirse a nuestro estudio ubicado en {job.location}.
              </p>
            </section>

            {/* Condiciones */}
            <section>
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-label-sm text-muted-foreground">Condiciones Generales</span>
                <div className="flex-1 border-t border-border/50"></div>
              </div>
              <ul className="space-y-4">
                {descriptionParts.map((part: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-4 mt-1.5 w-1.5 h-1.5 bg-black block flex-shrink-0"></span>
                    <span className="text-body-sm text-foreground/90">{part.trim()}</span>
                  </li>
                ))}
                {job.style && (
                  <li className="flex items-start">
                    <span className="mr-4 mt-1.5 w-1.5 h-1.5 bg-black block flex-shrink-0"></span>
                    <span className="text-body-sm text-foreground/90">Modalidad: {job.style}</span>
                  </li>
                )}
              </ul>
            </section>

          </div>
        </div>

        {/* Right Sidebar (Sticky) */}
        <aside className="w-full lg:w-80 flex-shrink-0 pt-4">
          <div className="sticky top-24 flex flex-col space-y-8">
            
            {/* Studio Profile block */}
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square bg-gray-50 border border-border flex items-center justify-center mb-6 overflow-hidden relative">
                {studio?.portada ? (
                  <Image 
                    src={studio.portada} 
                    alt={studio.nombre || "Estudio"} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 320px" 
                    className="object-cover" 
                  />
                ) : (
                  <Store className="w-12 h-12 text-muted-foreground/30" strokeWidth={1} />
                )}
              </div>
              
              <h3 className="text-h3 font-bold uppercase text-center break-words line-clamp-2">
                {studio?.nombre || job.studioName}
              </h3>
            </div>

            {studio && (
              <div className="flex space-x-4 w-full">
                {studio.instagram && (
                  <a href={`https://instagram.com/${studio.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="flex-1 border border-black bg-transparent text-black py-4 flex items-center justify-center hover:bg-black/5 transition-colors">
                    <span className="text-button">Instagram &rarr;</span>
                  </a>
                )}
                {studio.whatsapp && (
                  <a href={`https://wa.me/${studio.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex-1 border border-black bg-transparent text-black py-4 flex items-center justify-center hover:bg-black/5 transition-colors">
                    <span className="text-button">WhatsApp &rarr;</span>
                  </a>
                )}
              </div>
            )}

            <div className="w-full border-t border-border"></div>

            {/* Ubicación */}
            <div>
              <span className="text-label-sm text-muted-foreground mb-6 block">Ubicación del Estudio</span>
              <p className="text-body-sm text-center mb-4">
                {job.location}
              </p>
              <div className="w-full h-48 bg-gray-100 overflow-hidden border border-border">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0} 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(job.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            </div>
          </div>
        </aside>

      </main>

      <Footer />

      {/* Apply Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-[480px] p-8 md:p-12 shadow-modal border border-border animate-scale-in origin-center">
            <div className="flex justify-between items-center mb-8">
              <span className="text-label-sm text-muted-foreground">Postularse</span>
              <button onClick={() => setIsModalOpen(false)} className="text-black hover:text-black/60 transition-colors">
                <X className="w-8 h-8" strokeWidth={1} />
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-h2 uppercase leading-none mb-2">{job.title} {job.category}</h2>
              <p className="text-label-sm text-muted-foreground">{studio?.nombre || job.studioName}</p>
            </div>
            <div className="w-full border-t border-border mb-8"></div>

            <p className="text-body-sm text-muted-foreground mb-8">
              Contactá directamente al estudio mencionando que venís de Empleo Tattoo Argentina.
            </p>

            {studio?.whatsapp ? (
              <a 
                href={`https://wa.me/${studio.whatsapp.replace(/\D/g,'')}?text=Hola%2C+vi+tu+b%C3%BAsqueda+de+${encodeURIComponent(job.title)}+en+Empleo+Tattoo+Argentina+y+me+gustar%C3%ADa+postularme.`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-black text-white py-5 flex items-center justify-center space-x-3 hover:bg-black/90 transition-colors mb-4"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-button">Escribir por WhatsApp &rarr;</span>
              </a>
            ) : (
              <button disabled className="w-full bg-gray-200 text-gray-500 py-5 flex items-center justify-center space-x-3 mb-4 cursor-not-allowed">
                <span className="text-button">WhatsApp no disponible</span>
              </button>
            )}

            {studio?.instagram ? (
              <a 
                href={`https://instagram.com/${studio.instagram.replace('@','')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-transparent text-black border border-black py-5 flex items-center justify-center space-x-3 hover:bg-black/5 transition-colors mb-8"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="text-button">Ver Perfil de Instagram &rarr;</span>
              </a>
            ) : null}

            <p className="text-caption-sm text-center text-muted-foreground">
              El contacto es directo entre vos y el estudio.<br/>ETA no intermedia en el proceso.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
