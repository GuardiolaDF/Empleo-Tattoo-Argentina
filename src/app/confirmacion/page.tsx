"use client";

import { Check } from "lucide-react";
import Link from "next/link";

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 space-y-8">
      <div className="bg-white w-full max-w-xl border border-border">
        
        {/* Top Header */}
        <div className="p-8 md:p-12 pb-6">
          <div className="flex justify-between items-start mb-16">
            <span className="text-caption-sm mt-2">
              Transaction ID: #829314
            </span>
            <div className="bg-black text-white w-12 h-12 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
          </div>

          <h1 className="text-display-md mb-8 uppercase max-w-lg">
            Pago<br/>Confirmado.<br/>Oferta Activa.
          </h1>

          {/* Studio Info Card */}
          <div className="bg-gray-50 p-8 flex justify-between items-start border border-transparent">
            <div>
              <h2 className="text-h2 mb-1">Black Lung Studio</h2>
              <p className="text-body-sm text-muted-foreground">Tatuador Senior</p>
            </div>
            <div className="bg-black text-white px-3 py-1">
              <span className="text-caption-sm">En Línea</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-border/50"></div>

        {/* Steps */}
        <div className="p-8 md:p-12 space-y-8">
          
          <div className="flex gap-6">
            <span className="text-display-lg text-muted-foreground/30">01</span>
            <div>
              <h3 className="text-label-sm mb-2 mt-1.5">Gestión</h3>
              <p className="text-body-sm text-muted-foreground">
                Recibirás un link mágico en tu email para editar o pausar el anuncio.
              </p>
            </div>
          </div>

          <div className="w-full border-t border-border/50"></div>

          <div className="flex gap-6">
            <span className="text-display-lg text-muted-foreground/30">02</span>
            <div>
              <h3 className="text-label-sm mb-2 mt-1.5">Difusión</h3>
              <p className="text-body-sm text-muted-foreground">
                Tu oferta ya es visible en el feed principal y será compartida en nuestra red de Instagram.
              </p>
            </div>
          </div>

          <div className="w-full border-t border-border/50"></div>

          <div className="flex gap-6">
            <span className="text-display-lg text-muted-foreground/30">03</span>
            <div>
              <h3 className="text-label-sm mb-2 mt-1.5">Vencimiento</h3>
              <p className="text-body-sm text-muted-foreground">
                El anuncio expirará automáticamente en 30 días.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-8 md:p-12 pt-4 flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1 bg-black text-white py-5 flex items-center justify-center hover:bg-black/90 transition-colors">
            <span className="text-button">Ver mi anuncio en el feed</span>
          </Link>
          <button 
            onClick={() => alert('¡Funcionalidad en desarrollo! Pronto podrás compartir tu anuncio directamente a Instagram.')}
            className="flex-1 bg-white border border-border text-black py-5 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-button">Compartir en Instagram</span>
          </button>
        </div>

      </div>

      {/* NEW PROMINENT SECTION */}
      <div className="bg-muted w-full max-w-xl border border-black p-8 md:p-12 text-center">
        <span className="text-label-sm text-muted-foreground mb-6 block">Siguiente Paso</span>
        <h2 className="text-h2 uppercase mb-4 font-bold">Creá el Perfil de tu Estudio</h2>
        <p className="text-body-sm text-foreground/80 mb-8 max-w-md mx-auto">
          Aparecé en búsquedas, mostrá tu trabajo y recibí postulaciones directas de artistas. Es gratis.
        </p>
        <Link href="/dashboard/perfil" className="w-full bg-black text-white py-5 flex items-center justify-center hover:bg-black/90 transition-colors mb-6">
          <span className="text-button">Crear Perfil Ahora &rarr;</span>
        </Link>
        <p className="text-caption-sm text-muted-foreground">
          Ya tenés cuenta? <Link href="/auth/login" className="underline hover:text-black">Ingresá acá</Link>
        </p>
      </div>

    </div>
  );
}
