import Link from "next/link";

export default function ContactoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-200 items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 md:p-12 shadow-2xl relative">
        <p className="text-label-sm mb-4">
          Contacto
        </p>
        <h1 className="text-h1 mb-8">
          HABLEMOS.
        </h1>
        
        <hr className="border-black/10 mb-8" />
        
        <div className="space-y-8 mb-12">
          <div className="flex flex-col">
            <span className="text-label-sm mb-2">
              Email
            </span>
            <span className="text-h3 mb-4">
              hola@fabiguardiola.com
            </span>
            <a 
              href="mailto:hola@fabiguardiola.com"
              className="w-full text-center border border-black text-black px-6 py-3 text-button hover:bg-black/5 transition-colors"
            >
              Escribir un email →
            </a>
          </div>

          <div className="flex flex-col">
            <span className="text-label-sm mb-2">
              LinkedIn
            </span>
            <span className="text-h3 mb-4">
              /in/fabiguardiola
            </span>
            <a 
              href="https://www.linkedin.com/in/fabiguardiola/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center border border-black text-black px-6 py-3 text-button hover:bg-black/5 transition-colors"
            >
              Ver perfil →
            </a>
          </div>
        </div>

        <p className="text-caption-sm text-center">
          Respondemos en menos de 48 horas.
        </p>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-nav text-muted-foreground hover:text-black transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
