import Link from "next/link";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-12 md:gap-20">
        
        {/* Top Section */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-h2 italic uppercase">EMPLEO TATTOO ARGENTINA</h2>
            <a href="https://www.instagram.com/empleotattooarg/" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
              <Instagram className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
            </a>
          </div>
          <p className="text-subtitle text-white/70 mb-1">Conectando estudios y artistas en toda la Argentina</p>
          <p className="text-body-sm text-white/50">Un proyecto de Fabi Guardiola</p>
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          
          {/* Copyright */}
          <div className="text-label-sm text-white/30 uppercase">
            ©2025 EMPLEO TATTOO ARGENTINA. TODOS LOS DERECHOS RESERVADOS.
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap md:flex-nowrap gap-8 md:gap-12 text-label-sm text-white/70 uppercase md:pr-12">
            <div className="flex flex-col space-y-1">
              <Link href="/terminos" className="hover:text-white transition-colors leading-relaxed">Términos de<br/>Servicio</Link>
            </div>
            <div className="flex flex-col space-y-1">
              <Link href="/privacidad" className="hover:text-white transition-colors leading-relaxed">Política de<br/>Privacidad</Link>
            </div>
            <div className="flex flex-col space-y-1">
              <Link href="/guia-del-artista" className="hover:text-white transition-colors leading-relaxed">Guía del<br/>Artista</Link>
            </div>
            <div className="flex flex-col space-y-2">
              <a href="mailto:hola@fabiguardiola.com" className="hover:text-white transition-colors leading-none">Mail</a>
              <a href="https://www.linkedin.com/in/fabiguardiola/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors leading-none">LinkedIn</a>
            </div>
          </div>
          
        </div>
        
      </div>
    </footer>
  );
}
