import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ConvencionesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <span className="text-label-sm mb-8 block">
          Convenciones
        </span>
        
        <h1 className="text-display-xl mb-6">
          Muy Pronto.
        </h1>
        
        <p className="text-body-sm text-muted-foreground max-w-md mx-auto mb-12">
          El calendario de convenciones de tatuaje más completo de Argentina. Próximamente.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center space-x-3 border border-black bg-transparent text-black px-8 py-4 hover:bg-black/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-button">Volver al inicio</span>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
