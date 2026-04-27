import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-24 md:px-8">
        <Link href="/" className="inline-block font-sans text-xs tracking-widest uppercase mb-16 text-muted-foreground hover:text-black transition-colors">
          ← Volver
        </Link>
        <h1 className="font-serif text-5xl md:text-7xl tracking-tighter mb-4 uppercase">
          Términos de Servicio
        </h1>
        <p className="font-sans text-sm text-muted-foreground mb-24">
          Última actualización: 26 de Abril de 2026
        </p>
        
        <div className="space-y-16">
          <section>
            <h2 className="font-sans text-sm tracking-widest uppercase font-bold border-b border-black pb-4 mb-6">
              01. ACEPTACIÓN DE LOS TÉRMINOS
            </h2>
            <p className="font-sans text-base leading-relaxed text-foreground">
              Al acceder y utilizar Empleo Tattoo Argentina (ETA), usted acepta estar sujeto a estos Términos de Servicio. ETA es una plataforma de conexión entre artistas del tatuaje y estudios, y no participa en las relaciones laborales ni contractuales que puedan surgir de su uso.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm tracking-widest uppercase font-bold border-b border-black pb-4 mb-6">
              02. USO DE LA PLATAFORMA
            </h2>
            <p className="font-sans text-base leading-relaxed text-foreground">
              Los estudios y artistas se comprometen a proporcionar información veraz, precisa y actualizada. Está estrictamente prohibido publicar contenido ofensivo, discriminatorio, o usar la plataforma para fines ilícitos. ETA se reserva el derecho de eliminar cualquier publicación que infrinja estas normas sin previo aviso.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm tracking-widest uppercase font-bold border-b border-black pb-4 mb-6">
              03. RESPONSABILIDAD LIMITADA
            </h2>
            <p className="font-sans text-base leading-relaxed text-foreground">
              ETA actúa exclusivamente como intermediario de información. No somos responsables de la calidad del ambiente de trabajo, las condiciones de salubridad de los estudios, ni del desempeño o profesionalismo de los artistas contratados a través de nuestra plataforma.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
