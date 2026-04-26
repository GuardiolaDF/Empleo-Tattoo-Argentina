import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-16">
        <div>
          <h2 className="font-serif text-3xl italic mb-2">EMPLEO TATTOO ARGENTINA</h2>
          <p className="font-serif italic text-white/70 mb-1">Conectando estudios y artistas en toda la Argentina</p>
          <p className="font-sans text-xs text-white/50">Un proyecto de Fabi Guardiola</p>
        </div>
        
        <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 flex flex-col md:flex-row flex-wrap gap-2">
          <span>© 2026 Empleo Tattoo Argentina</span>
          <span className="hidden md:inline">—</span>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
            <span>·</span>
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <span>·</span>
            <Link href="/guia-del-artista" className="hover:text-white transition-colors">Guía del Artista</Link>
            <span>·</span>
            <a href="mailto:hola@fabiguardiola.com" className="hover:text-white transition-colors">Mail</a>
            <span>·</span>
            <a href="https://www.linkedin.com/in/fabiguardiola/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
