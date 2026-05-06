import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, ArrowRight, CodeXml } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
        
        {/* Left Column: Summary Info */}
        <div className="flex flex-col">
          <Link href="/publicar-empleo" className="flex items-center space-x-2 text-muted-foreground hover:text-black transition-colors mb-24">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-nav">Volver</span>
          </Link>
          
          <h1 className="text-display-xl mb-16 uppercase">
            RESUMEN
          </h1>
          
          <div className="flex">
            {/* Vertical Divider Line */}
            <div className="w-[2px] bg-black mr-6"></div>
            
            <div className="flex flex-col justify-center py-4">
              <span className="text-label-sm text-muted-foreground mb-2">
                Ítem
              </span>
              <p className="text-subtitle">
                Publicación de Oferta — 30 días
              </p>
            </div>
          </div>

          <div className="mt-24">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-8 h-[1px] bg-border"></div>
              <span className="text-label-sm text-muted-foreground">
                Vista Previa
              </span>
            </div>
            
            {/* Mini Preview Card */}
            <div className="bg-white border border-border p-6 w-full max-w-xs transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <span className="text-caption-sm text-muted-foreground mb-2 block">Oferta de Empleo</span>
              <h3 className="text-h3 mb-1">Tatuador</h3>
              <p className="text-body-sm text-muted-foreground">en Black Lung Studio</p>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Card */}
        <div className="flex items-center">
          <div className="bg-white border border-border w-full">
            
            {/* Subtotal & Taxes row */}
            <div className="grid grid-cols-2 border-b border-border">
              <div className="p-8 md:p-12 border-r border-border flex flex-col justify-center">
                <span className="text-label-sm text-muted-foreground mb-2">Subtotal</span>
                <span className="text-h2">$150</span>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="text-label-sm text-muted-foreground mb-2">Impuestos</span>
                <span className="text-h2 text-muted-foreground">$0.00</span>
              </div>
            </div>
            
            {/* Total row */}
            <div className="p-8 md:p-12 border-b border-border bg-gray-50/50">
              <span className="text-label-sm text-muted-foreground mb-2 block">Total</span>
              <span className="text-display-lg">$150</span>
            </div>

            {/* Mercado Pago area */}
            <div className="p-8 md:p-12">
              
              {/* MP Container Placeholder */}
              <div className="border border-dashed border-border p-8 mb-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                <CodeXml className="w-6 h-6 mb-4 opacity-50" />
                <span className="text-label-sm max-w-[200px]">
                  Generar contenedor para Smart Checkout de Mercado Pago
                </span>
              </div>
              
              <button 
                type="button" 
                className="w-full bg-black text-white py-5 flex items-center justify-center space-x-3 hover:bg-black/90 transition-colors"
              >
                <span className="text-button">Pagar con Mercado Pago</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
