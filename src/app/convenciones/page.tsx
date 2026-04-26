import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ConvencionesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-8 block">
          Convenciones
        </span>
        
        <h1 className="font-serif text-5xl md:text-7xl tracking-tighter uppercase mb-6 leading-none">
          Muy Pronto.
        </h1>
        
        <p className="font-sans text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-12">
          El calendario de convenciones de tatuaje más completo de Argentina. Próximamente.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center space-x-3 border border-black bg-transparent text-black px-8 py-4 hover:bg-black/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans text-[10px] tracking-widest uppercase">Volver al inicio</span>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
