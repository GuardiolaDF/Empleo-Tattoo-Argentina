import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

export default function EstudiosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="font-serif text-6xl md:text-[8rem] tracking-tighter leading-[0.85] mb-12 uppercase max-w-5xl mx-auto">
          CONECTÁ CON EL<br/>TALENTO QUE TU<br/>ESTUDIO NECESITA.
        </h1>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          La plataforma de búsqueda técnica para tatuadores y perforadores en Argentina.
        </p>
      </section>

      {/* Features Strip */}
      <section className="border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="flex flex-col space-y-8">
            <span className="font-sans text-[10px] tracking-widest text-muted-foreground">01</span>
            <h3 className="font-serif text-3xl tracking-tight uppercase">Audiencia<br/>Segmentada</h3>
          </div>
          <div className="flex flex-col space-y-8">
            <span className="font-sans text-[10px] tracking-widest text-muted-foreground">02</span>
            <h3 className="font-serif text-3xl tracking-tight uppercase">Gestión<br/>Directa</h3>
          </div>
          <div className="flex flex-col space-y-8">
            <span className="font-sans text-[10px] tracking-widest text-muted-foreground">03</span>
            <h3 className="font-serif text-3xl tracking-tight uppercase">Alcance<br/>Nacional</h3>
          </div>
        </div>
      </section>

      {/* Pricing Block */}
      <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-black text-white p-12 md:p-24 flex flex-col md:flex-row gap-16 md:gap-8 items-center justify-between">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/70 mb-4">Pago único por publicación</p>
            <h2 className="font-serif text-8xl md:text-[10rem] tracking-tighter leading-none">$150</h2>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-8">
            <ul className="space-y-4 font-sans text-sm tracking-wide text-white/90">
              <li className="flex items-center space-x-3">
                <ArrowRight className="w-4 h-4 text-white/50" />
                <span>Duración: 30 días</span>
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
              className="bg-white text-black px-12 py-5 text-xs tracking-[0.2em] uppercase font-sans hover:bg-gray-200 transition-colors inline-block w-full text-center"
            >
              Empezar Publicación
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 md:px-8 max-w-3xl mx-auto w-full mb-24">
        <h3 className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-12 text-center md:text-left">Preguntas Frecuentes</h3>
        
        <div className="flex flex-col space-y-8">
          <details className="group border-b border-border pb-6 cursor-pointer marker:content-['']">
            <summary className="flex items-center justify-between font-serif text-2xl tracking-tight list-none">
              ¿Cuánto dura mi anuncio?
              <Plus className="w-5 h-5 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-4 font-sans text-sm text-muted-foreground leading-relaxed pr-8">
              Tu anuncio estará visible durante 30 días completos desde el momento de la publicación y pago exitoso.
            </p>
          </details>

          <details className="group border-b border-border pb-6 cursor-pointer marker:content-['']">
            <summary className="flex items-center justify-between font-serif text-2xl tracking-tight list-none">
              ¿Cómo pago con Mercado Pago?
              <Plus className="w-5 h-5 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-4 font-sans text-sm text-muted-foreground leading-relaxed pr-8">
              Al hacer clic en "Empezar Publicación", serás redirigido a nuestro portal de pago seguro operado por Mercado Pago. Aceptamos todas las tarjetas de crédito, débito y dinero en cuenta.
            </p>
          </details>

          <details className="group border-b border-border pb-6 cursor-pointer marker:content-['']">
            <summary className="flex items-center justify-between font-serif text-2xl tracking-tight list-none">
              ¿Puedo editarlo después?
              <Plus className="w-5 h-5 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-4 font-sans text-sm text-muted-foreground leading-relaxed pr-8">
              Sí, recibirás un link mágico en tu correo que te permitirá pausar, editar o cancelar tu anuncio en cualquier momento.
            </p>
          </details>
        </div>
      </section>

      <Footer />
    </div>
  );
}
