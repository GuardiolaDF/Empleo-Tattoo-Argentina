import { Check } from "lucide-react";
import Link from "next/link";

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F4F4] px-4 py-12 space-y-8">
      <div className="bg-white w-full max-w-2xl border border-border">
        
        {/* Top Header */}
        <div className="p-8 md:p-12 pb-6">
          <div className="flex justify-between items-start mb-16">
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-2">
              Transaction ID: #829314
            </span>
            <div className="bg-black text-white w-12 h-12 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl tracking-tight leading-[1.1] mb-12 uppercase max-w-lg">
            Pago<br/>Confirmado.<br/>Oferta Activa.
          </h1>

          {/* Studio Info Card */}
          <div className="bg-[#F4F4F4] p-8 flex justify-between items-start border border-transparent">
            <div>
              <h2 className="font-serif text-3xl tracking-tight mb-1">Black Lung Studio</h2>
              <p className="font-sans text-sm text-muted-foreground">Tatuador Senior</p>
            </div>
            <div className="bg-black text-white px-3 py-1">
              <span className="font-sans text-[8px] tracking-[0.2em] uppercase">En Línea</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-border/50"></div>

        {/* Steps */}
        <div className="p-8 md:p-12 space-y-8">
          
          <div className="flex gap-6">
            <span className="font-sans text-2xl tracking-widest text-muted-foreground/30 font-light">01</span>
            <div>
              <h3 className="font-sans text-[10px] tracking-[0.2em] uppercase mb-2 mt-1.5">Gestión</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Recibirás un link mágico en tu email para editar o pausar el anuncio.
              </p>
            </div>
          </div>

          <div className="w-full border-t border-border/50"></div>

          <div className="flex gap-6">
            <span className="font-sans text-2xl tracking-widest text-muted-foreground/30 font-light">02</span>
            <div>
              <h3 className="font-sans text-[10px] tracking-[0.2em] uppercase mb-2 mt-1.5">Difusión</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Tu oferta ya es visible en el feed principal y será compartida en nuestra red de Instagram.
              </p>
            </div>
          </div>

          <div className="w-full border-t border-border/50"></div>

          <div className="flex gap-6">
            <span className="font-sans text-2xl tracking-widest text-muted-foreground/30 font-light">03</span>
            <div>
              <h3 className="font-sans text-[10px] tracking-[0.2em] uppercase mb-2 mt-1.5">Vencimiento</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                El anuncio expirará automáticamente en 30 días.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-8 md:p-12 pt-4 flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1 bg-black text-white py-5 flex items-center justify-center hover:bg-black/90 transition-colors">
            <span className="font-sans text-[10px] md:text-xs tracking-widest uppercase">Ver mi anuncio en el feed</span>
          </Link>
          <button className="flex-1 bg-white border border-border text-black py-5 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <span className="font-sans text-[10px] md:text-xs tracking-widest uppercase">Copiar link para Instagram</span>
          </button>
        </div>

      </div>

      {/* NEW PROMINENT SECTION */}
      <div className="bg-muted w-full max-w-2xl border border-black p-8 md:p-12 text-center">
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-6 block">Siguiente Paso</span>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight uppercase mb-4 font-bold">Creá el Perfil de tu Estudio</h2>
        <p className="font-sans text-sm text-foreground/80 leading-relaxed mb-8 max-w-md mx-auto">
          Aparecé en búsquedas, mostrá tu trabajo y recibí postulaciones directas de artistas. Es gratis.
        </p>
        <Link href="/dashboard/perfil" className="w-full bg-black text-white py-5 flex items-center justify-center hover:bg-black/90 transition-colors mb-6">
          <span className="font-sans text-xs tracking-widest uppercase">Crear Perfil Ahora &rarr;</span>
        </Link>
        <p className="font-sans text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
          Ya tenés cuenta? <Link href="/auth/login" className="underline hover:text-black">Ingresá acá</Link>
        </p>
      </div>

    </div>
  );
}
