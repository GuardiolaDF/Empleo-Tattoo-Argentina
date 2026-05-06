import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between gap-12">
        <div className="flex-1">
          <h2 className="text-h2 italic mb-2">EMPLEO TATTOO ARGENTINA</h2>
          <p className="text-subtitle text-white/70 mb-1">Conectando estudios y artistas en toda la Argentina</p>
          <p className="text-body-sm text-white/50">Un proyecto de Fabi Guardiola</p>
          
          <div className="mt-20 text-label-sm text-white/30">
            ©2025 Empleo Tattoo Argentina. Todos los derechos reservados.
          </div>
        </div>
        
        <div className="flex flex-wrap gap-8 md:gap-16 text-label-sm text-white/70">
          <div className="flex flex-col space-y-4">
            <Link href="/terminos" className="hover:text-white transition-colors">Términos de<br/>Servicio</Link>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/privacidad" className="hover:text-white transition-colors">Política de<br/>Privacidad</Link>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/guia-del-artista" className="hover:text-white transition-colors">Guía del<br/>Artista</Link>
          </div>
          <div className="flex flex-col space-y-4">
            <a href="mailto:hola@fabiguardiola.com" className="hover:text-white transition-colors">Mail</a>
            <a href="https://www.linkedin.com/in/fabiguardiola/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
