"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function EstudiosPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="bg-gray-50">
        <Navbar />

        {/* Hero Section */}
        <section className="flex flex-col justify-center w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 min-h-[calc(100svh-var(--navbar-height))] md:min-h-[calc(100vh-var(--navbar-height))] py-12">
          <div className="flex flex-col items-start text-left w-full">
            <h1 className="text-display-xl leading-[0.9] mb-6 uppercase max-w-none">
              Contratá a los mejores<br className="hidden md:block" /> artistas del país.
            </h1>
            <p className="text-label-sm leading-relaxed max-w-2xl">
              La plataforma de búsqueda técnica para tatuadores y perforadores en Argentina.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-start gap-4 w-full mt-10">
            <Link 
              href="/publicar-empleo" 
              className="bg-black text-white px-12 py-5 text-button hover:bg-black/90 transition-colors inline-block text-center flex-1 sm:flex-none"
            >
              PUBLICAR AVISO
            </Link>
            {!isLoggedIn && (
              <Link 
                href="/dashboard/perfil" 
                className="bg-white text-black border border-black px-12 py-5 text-button hover:bg-gray-50 transition-colors inline-block text-center flex-1 sm:flex-none"
              >
                CREAR CUENTA
              </Link>
            )}
          </div>
        </section>
      </div>

      {/* Features Strip */}
      <section className="border-y border-border py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h2 className="text-label text-center mb-12">
          Beneficios
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          <div className="flex flex-col text-center md:text-left space-y-6">
            <span className="text-display-lg text-muted-foreground/30">01</span>
            <div>
              <h3 className="text-h3 uppercase">Audiencia<br/>Segmentada</h3>
            </div>
          </div>
          <div className="flex flex-col text-center md:text-left space-y-6">
            <span className="text-display-lg text-muted-foreground/30">02</span>
            <div>
              <h3 className="text-h3 uppercase">Gestión<br/>Directa</h3>
            </div>
          </div>
          <div className="flex flex-col text-center md:text-left space-y-6">
            <span className="text-display-lg text-muted-foreground/30">03</span>
            <div>
              <h3 className="text-h3 uppercase">Alcance<br/>Nacional</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Block */}
      <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-black text-white p-8 md:p-16 lg:p-24 flex flex-col md:flex-row gap-12 md:gap-8 items-center justify-between">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-label-sm text-white/70 mb-4">Pago único por publicación</p>
            <h2 className="text-display-2xl text-white leading-none">$ 20.000</h2>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-8">
            <ul className="space-y-4 text-body-sm text-white/90">
              <li className="flex items-center space-x-3">
                <ArrowRight className="w-4 h-4 text-white/50" />
                <span>Editá tu publicación por 30 días</span>
              </li>
              <li className="flex items-center space-x-3">
                <ArrowRight className="w-4 h-4 text-white/50" />
                <span>Link directo a tu perfil</span>
              </li>
              <li className="flex items-center space-x-3">
                <ArrowRight className="w-4 h-4 text-white/50" />
                <span>Publicación inmediata</span>
              </li>
              <li className="flex items-center space-x-3">
                <ArrowRight className="w-4 h-4 text-white/50" />
                <span>Soporte técnico</span>
              </li>
            </ul>
            
            <Link 
              href="/publicar-empleo" 
              className="bg-white text-black px-12 py-5 text-button hover:bg-gray-200 transition-colors inline-block w-full text-center"
            >
              PUBLICAR AVISO
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-8 max-w-3xl mx-auto w-full mb-16 md:mb-24">
        <h3 className="text-label-lg mb-12 text-center md:text-left">Preguntas Frecuentes</h3>
        
        <div className="flex flex-col space-y-8">
          <details className="group border-b border-border pb-6 cursor-pointer marker:content-['']">
            <summary className="flex items-center justify-between text-h3 list-none">
              ¿Cuánto dura mi anuncio?
              <Plus className="w-5 h-5 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-4 text-body-sm text-muted-foreground pr-8">
              Tu anuncio estará visible de forma permanente hasta que vos lo pausés, elimines o indiqués que la vacante fue cubierta. Durante los primeros 30 días podés editar toda la información de la publicación.
            </p>
          </details>

          <details className="group border-b border-border pb-6 cursor-pointer marker:content-['']">
            <summary className="flex items-center justify-between text-h3 list-none">
              ¿Cómo se realiza el pago?
              <Plus className="w-5 h-5 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-4 text-body-sm text-muted-foreground pr-8">
              Al hacer click en 'Publicar un Empleo' serás redirigido a un formulario donde completás los datos del estudio y el rol que buscás. Al finalizar, la plataforma te llevará al checkout de Mercado Pago donde podés pagar con tarjeta de crédito, débito o dinero en cuenta.
            </p>
          </details>

          <details className="group border-b border-border pb-6 cursor-pointer marker:content-['']">
            <summary className="flex items-center justify-between text-h3 list-none">
              ¿Puedo editar mi publicación después?
              <Plus className="w-5 h-5 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-4 text-body-sm text-muted-foreground pr-8">
              Sí. Recibirás un link en tu correo que te permitirá editar o pausar tu anuncio durante los primeros 30 días. Pasado ese plazo, la publicación queda fija hasta que indiques que la vacante fue cubierta o la elimines.
            </p>
          </details>

          <details className="group border-b border-border pb-6 cursor-pointer marker:content-['']">
            <summary className="flex items-center justify-between text-h3 list-none">
              ¿Qué pasa si ya encontré al artista que buscaba?
              <Plus className="w-5 h-5 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-4 text-body-sm text-muted-foreground pr-8">
              Podés pausar o eliminar tu anuncio en cualquier momento usando el link que recibís por email. Así mantenés el feed limpio y relevante para todos.
            </p>
          </details>

          <details className="group border-b border-border pb-6 cursor-pointer marker:content-['']">
            <summary className="flex items-center justify-between text-h3 list-none">
              ¿Mi publicación aparece en búsquedas de Google?
              <Plus className="w-5 h-5 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-4 text-body-sm text-muted-foreground pr-8">
              Sí. Cada publicación tiene su propia página indexada, lo que aumenta las chances de que artistas te encuentren orgánicamente, incluso fuera de la plataforma.
            </p>
          </details>
        </div>
      </section>

      <Footer />
    </div>
  );
}
