"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, ArrowRight, Store, MessageCircle, ExternalLink, X } from "lucide-react";
import Link from "next/link";

export default function JobListingPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-16 flex flex-col lg:flex-row gap-16 lg:gap-32">
        
        {/* Left Column (Main Content) */}
        <div className="flex-1">
          <button onClick={() => router.back()} className="inline-flex items-center space-x-2 text-muted-foreground hover:text-black transition-colors mb-16">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-nav">Volver</span>
          </button>

          <h1 className="text-display-xl mb-12">
            Tatuador<br/>Blackwork
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <Link href="/estudios/void-tattoo-club" className="text-nav underline hover:text-muted-foreground transition-colors">
              Void Tattoo Club
            </Link>
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
              <p className="text-body text-foreground/90">
                Buscamos un artista residente especializado en blackwork y tradicional para unirse a nuestro equipo. Somos un estudio privado enfocado en proyectos custom de alta calidad. Buscamos a alguien con portfolio sólido, proactivo y con ganas de crecer junto al estudio. El ambiente de trabajo es relajado pero profesional, priorizando el respeto por el arte y los clientes.
              </p>
            </section>

            {/* Requisitos */}
            <section>
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-label-sm text-muted-foreground">Requisitos</span>
                <div className="flex-1 border-t border-border/50"></div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-4 mt-1.5 w-1.5 h-1.5 bg-black block flex-shrink-0"></span>
                  <span className="text-body-sm text-foreground/90">Mínimo 3 años de experiencia en estudio.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-4 mt-1.5 w-1.5 h-1.5 bg-black block flex-shrink-0"></span>
                  <span className="text-body-sm text-foreground/90">Portfolio comprobable en Instagram u otra plataforma.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-4 mt-1.5 w-1.5 h-1.5 bg-black block flex-shrink-0"></span>
                  <span className="text-body-sm text-foreground/90">Licencia higiénico-sanitaria al día.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-4 mt-1.5 w-1.5 h-1.5 bg-black block flex-shrink-0"></span>
                  <span className="text-body-sm text-foreground/90">Puntualidad, orden y compromiso con la limpieza del estudio.</span>
                </li>
              </ul>
            </section>

            {/* Días y Horarios */}
            <section>
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-label-sm text-muted-foreground">Días y Horarios</span>
                <div className="flex-1 border-t border-border/50"></div>
              </div>
              
              <div className="flex flex-col space-y-4 text-body-sm text-foreground/90">
                <div className="flex justify-between border-b border-border/20 pb-4">
                  <span className="text-label-sm">Martes a Viernes</span>
                  <span>12:00 - 20:00</span>
                </div>
                <div className="flex justify-between border-b border-border/20 pb-4">
                  <span className="text-label-sm">Sábado</span>
                  <span>11:00 - 18:00</span>
                </div>
                <div className="flex justify-between text-muted-foreground pb-2">
                  <span className="text-label-sm">Domingo - Lunes</span>
                  <span>CERRADO</span>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Right Sidebar (Sticky) */}
        <aside className="w-full lg:w-80 flex-shrink-0 pt-4">
          <div className="sticky top-24 flex flex-col space-y-8">
            
            {/* Studio Profile block */}
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square bg-gray-50 border border-border flex items-center justify-center mb-6">
                <Store className="w-12 h-12 text-muted-foreground/30" strokeWidth={1} />
              </div>
              
              <h3 className="text-h3 font-bold uppercase text-center">
                Void Tattoo Club
              </h3>
            </div>

            <div className="flex space-x-4 w-full">
              <button className="flex-1 border border-black bg-transparent text-black py-4 flex items-center justify-center hover:bg-black/5 transition-colors">
                <span className="text-button">Instagram &rarr;</span>
              </button>
              <button className="flex-1 border border-black bg-transparent text-black py-4 flex items-center justify-center hover:bg-black/5 transition-colors">
                <span className="text-button">WhatsApp &rarr;</span>
              </button>
            </div>

            <div className="w-full border-t border-border"></div>

            {/* Ubicación */}
            <div>
              <span className="text-label-sm text-muted-foreground mb-6 block">Ubicación del Estudio</span>
              
              <div className="w-full h-64 bg-gray-200 border border-border flex items-center justify-center relative overflow-hidden group">
                <div className="w-3 h-3 bg-black z-10 relative"></div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
              </div>
              <p className="text-label-sm text-muted-foreground mt-4 text-center">
                Madrid, Centro
              </p>
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
          <div className="relative bg-white w-full max-w-[480px] p-8 md:p-12 shadow-modal border border-border">
            {/* 1. Top row */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-label-sm text-muted-foreground">Postularse</span>
              <button onClick={() => setIsModalOpen(false)} className="text-black hover:text-black/60 transition-colors">
                <X className="w-8 h-8" strokeWidth={1} />
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-h2 uppercase leading-none mb-2">Tatuador Blackwork</h2>
              <p className="text-label-sm text-muted-foreground">Void Tattoo Club</p>
            </div>
            <div className="w-full border-t border-border mb-8"></div>

            <p className="text-body-sm text-muted-foreground mb-8">
              Contactá directamente al estudio mencionando que venís de Empleo Tattoo Argentina.
            </p>

            <a 
              href="https://wa.me/5491112345678?text=Hola%2C+vi+tu+b%C3%BAsqueda+de+Tatuador+Blackwork+en+Empleo+Tattoo+Argentina+y+me+gustar%C3%ADa+postularme." 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-black text-white py-5 flex items-center justify-center space-x-3 hover:bg-black/90 transition-colors mb-4"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-button">Escribir por WhatsApp &rarr;</span>
            </a>

            <a 
              href="https://instagram.com/voidtattooclub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-transparent text-black border border-black py-5 flex items-center justify-center space-x-3 hover:bg-black/5 transition-colors mb-8"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="text-button">Ver Perfil de Instagram &rarr;</span>
            </a>

            {/* 6. Footer text */}
            <p className="text-caption-sm text-center">
              El contacto es directo entre vos y el estudio.<br/>ETA no intermedia en el proceso.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
