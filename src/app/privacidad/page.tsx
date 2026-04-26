import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F4]">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-24 md:px-8">
        <Link href="/" className="inline-block font-sans text-xs tracking-widest uppercase mb-16 text-muted-foreground hover:text-black transition-colors">
          ← Volver
        </Link>
        <h1 className="font-serif text-5xl md:text-7xl tracking-tighter mb-4 uppercase">
          Política de Privacidad
        </h1>
        <p className="font-sans text-sm text-muted-foreground mb-24">
          Última actualización: 26 de Abril de 2026
        </p>
        
        <div className="space-y-16">
          <section>
            <h2 className="font-sans text-sm tracking-widest uppercase font-bold border-b border-black pb-4 mb-6">
              01. RECOPILACIÓN DE DATOS
            </h2>
            <p className="font-sans text-base leading-relaxed text-[#333333]">
              Recopilamos la información que usted nos proporciona directamente al crear una cuenta, publicar una oferta de empleo o aplicar a un puesto. Esto incluye su nombre, dirección de correo electrónico, enlaces a redes sociales y portfolios, e información de contacto del estudio.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm tracking-widest uppercase font-bold border-b border-black pb-4 mb-6">
              02. USO DE LA INFORMACIÓN
            </h2>
            <p className="font-sans text-base leading-relaxed text-[#333333]">
              Utilizamos sus datos exclusivamente para facilitar la conexión entre estudios y artistas. La información de los estudios es pública, mientras que los datos de contacto directos pueden ser gestionados según sus preferencias. No vendemos ni comercializamos sus datos personales con terceros.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-sm tracking-widest uppercase font-bold border-b border-black pb-4 mb-6">
              03. SEGURIDAD Y RETENCIÓN
            </h2>
            <p className="font-sans text-base leading-relaxed text-[#333333]">
              Implementamos medidas de seguridad estándar de la industria para proteger su información personal. Retenemos sus datos mientras su cuenta esté activa o según sea necesario para brindarle nuestros servicios y cumplir con nuestras obligaciones legales.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
