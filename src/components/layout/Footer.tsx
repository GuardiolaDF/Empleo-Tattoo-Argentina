import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between gap-12">
        <div className="flex-1">
          <h2 className="font-serif text-3xl italic mb-2">EMPLEO TATTOO ARGENTINA</h2>
          <p className="font-serif italic text-white/70 mb-1">Conectando estudios y artistas en toda la Argentina</p>
          <p className="font-sans text-xs text-white/50">Un proyecto de Fabi Guardiola</p>
          
          <div className="mt-20 font-sans text-[10px] tracking-[0.2em] uppercase text-white/30">
            ©2025 Empleo Tattoo Argentina. Todos los derechos reservados.
          </div>
        </div>
        
        <div className="flex flex-wrap gap-8 md:gap-16 font-sans text-[10px] tracking-[0.2em] uppercase text-white/70">
          <div className="flex flex-col space-y-4">
            <Link href="#" className="hover:text-white transition-colors leading-relaxed">Términos de<br/>Servicio</Link>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="#" className="hover:text-white transition-colors leading-relaxed">Política de<br/>Privacidad</Link>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="#" className="hover:text-white transition-colors leading-relaxed">Guía del<br/>Artista</Link>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="#" className="hover:text-white transition-colors leading-relaxed">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
