import Link from "next/link";

export default function ContactoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#D6D6D6] items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 md:p-12 shadow-2xl relative">
        <p className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground mb-4">
          Contacto
        </p>
        <h1 className="font-serif text-4xl tracking-tight mb-8">
          HABLEMOS.
        </h1>
        
        <hr className="border-black/10 mb-8" />
        
        <div className="space-y-8 mb-12">
          <div className="flex flex-col">
            <span className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
              Email
            </span>
            <span className="font-serif text-lg mb-4">
              hola@fabiguardiola.com
            </span>
            <a 
              href="mailto:hola@fabiguardiola.com"
              className="w-full text-center border border-black text-black px-6 py-3 font-sans text-xs tracking-widest uppercase hover:bg-black/5 transition-colors"
            >
              Escribir un email →
            </a>
          </div>

          <div className="flex flex-col">
            <span className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
              LinkedIn
            </span>
            <span className="font-serif text-lg mb-4">
              /in/fabiguardiola
            </span>
            <a 
              href="https://www.linkedin.com/in/fabiguardiola/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center border border-black text-black px-6 py-3 font-sans text-xs tracking-widest uppercase hover:bg-black/5 transition-colors"
            >
              Ver perfil →
            </a>
          </div>
        </div>

        <p className="font-sans text-xs text-muted-foreground text-center">
          Respondemos en menos de 48 horas.
        </p>
      </div>

      <div className="mt-8">
        <Link href="/" className="font-sans text-xs tracking-widest uppercase text-muted-foreground hover:text-black transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
