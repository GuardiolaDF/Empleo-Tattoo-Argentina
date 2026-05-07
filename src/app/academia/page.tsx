import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AcademiaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="bg-gray-50 flex-1 flex flex-col">
        <Navbar />

        <main className="flex flex-col justify-center w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 min-h-[calc(100svh-var(--navbar-height))] md:min-h-[calc(100vh-var(--navbar-height))] py-12">
          <div className="flex flex-col items-start text-left w-full">
            <span className="text-label-sm leading-relaxed mb-6 block">
              Academia
            </span>
            
            <h1 className="text-display-xl leading-[0.9] mb-6">
              Muy Pronto.
            </h1>
            
            <p className="text-body-sm text-muted-foreground leading-relaxed max-w-md">
              Estamos preparando algo especial para la comunidad del tatuaje. Cursos, recursos y más.
            </p>
          </div>
          
          <div className="flex flex-row justify-start gap-4 w-full mt-10">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center space-x-3 border border-black bg-transparent text-black px-8 py-4 hover:bg-black/5 transition-colors text-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-button">Volver al inicio</span>
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
