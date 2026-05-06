import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function GuiaDelArtistaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-24 md:px-8">
        <Link href="/" className="inline-block text-nav mb-16 text-muted-foreground hover:text-black transition-colors">
          ← Volver
        </Link>
        
        <h1 className="text-display-xl mb-6">
          GUÍA DEL ARTISTA
        </h1>
        <p className="text-subtitle text-muted-foreground mb-16">
          Cómo encontrar tu próximo estudio en ETA
        </p>

        <hr className="border-black/10 mb-16" />

        <p className="text-body-lg text-foreground mb-24 max-w-3xl">
          Empleo Tattoo Argentina (ETA) es la primera plataforma exclusiva diseñada para profesionalizar y facilitar la búsqueda de empleo en la industria del tatuaje en el país. Ya sea que busques tu primer puesto como residente, un espacio para alquilar por día, o un estudio comercial de alto volumen, esta guía te mostrará cómo maximizar tus oportunidades.
        </p>

        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8">
            <span className="text-display-lg text-muted-foreground/30">01</span>
            <div>
              <h3 className="text-label-lg font-bold mb-4">PREPARA TU PORTFOLIO</h3>
              <p className="text-body text-foreground">
                Tu Instagram es tu currículum. Antes de aplicar a cualquier estudio, asegúrate de que tu feed refleje tu mejor nivel técnico y sanitario. Elimina fotos borrosas, curadas en exceso con filtros, y mantén un nivel de profesionalismo constante.
              </p>
            </div>
          </div>
          <hr className="border-black/10" />

          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8">
            <span className="text-display-lg text-muted-foreground/30">02</span>
            <div>
              <h3 className="text-label-lg font-bold mb-4">IDENTIFICA TU ROL IDEAL</h3>
              <p className="text-body text-foreground">
                La industria ofrece diferentes dinámicas: ¿prefieres alquilar un box para atender a tu propia clientela, o buscas ser residente con porcentaje absorbiendo clientes del estudio? Define tu objetivo para filtrar las ofertas correctas.
              </p>
            </div>
          </div>
          <hr className="border-black/10" />

          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8">
            <span className="text-display-lg text-muted-foreground/30">03</span>
            <div>
              <h3 className="text-label-lg font-bold mb-4">UTILIZA LOS FILTROS DE ETA</h3>
              <p className="text-body text-foreground">
                Aprovecha nuestra barra de filtros en la página principal. Filtra por tu especialidad técnica, tu nivel de experiencia y tu ubicación deseada. Esto te ahorrará tiempo y evitará que envíes solicitudes a estudios que buscan otro perfil.
              </p>
            </div>
          </div>
          <hr className="border-black/10" />

          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8">
            <span className="text-display-lg text-muted-foreground/30">04</span>
            <div>
              <h3 className="text-label-lg font-bold mb-4">EL PRIMER CONTACTO</h3>
              <p className="text-body text-foreground">
                Cuando un estudio publica una oferta, ETA te proporcionará el canal directo de comunicación (WhatsApp, Email o Formulario). Al contactarlos, sé breve, presentate profesionalmente y envía el enlace directo a tu portfolio.
              </p>
            </div>
          </div>
          <hr className="border-black/10" />

          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8">
            <span className="text-display-lg text-muted-foreground/30">05</span>
            <div>
              <h3 className="text-label-lg font-bold mb-4">MANTENTE ACTUALIZADO</h3>
              <p className="text-body text-foreground">
                Las mejores ofertas de estudios reconocidos se cubren rápido. Suscríbete a nuestro newsletter para recibir alertas de nuevos puestos vacantes directamente en tu correo antes de que se difundan masivamente.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-16 border-t border-black text-center">
          <h2 className="text-h2 mb-6">¿Tenés alguna duda?</h2>
          <p className="text-body text-foreground mb-8">
            Estamos acá para ayudarte a navegar la industria.
          </p>
          <a href="mailto:hola@fabiguardiola.com" className="inline-block bg-black text-white px-8 py-4 text-button hover:bg-black/80 transition-colors">
            Contactar a Soporte
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
