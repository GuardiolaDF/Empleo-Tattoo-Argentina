import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Settings2 } from "lucide-react";
import Link from "next/link";

// Duplicado local de JobCard para no modificar archivos existentes
type JobVariant = 'white' | 'dark' | 'image' | 'gray';

interface JobCardProps {
  variant: JobVariant;
  studioName?: string;
  role: string;
  specialty: string;
  location: string;
}

function JobCard({ variant, studioName, role, specialty, location }: JobCardProps) {
  let variantClasses = "";
  let textClasses = "";
  let overlay = null;
  
  switch (variant) {
    case 'white':
      variantClasses = "bg-white";
      textClasses = "text-black";
      break;
    case 'dark':
      variantClasses = "bg-[#252525]";
      textClasses = "text-white";
      break;
    case 'image':
      variantClasses = "bg-cover bg-center relative";
      textClasses = "text-white relative z-10";
      overlay = <div className="absolute inset-0 bg-black/80 z-0"></div>;
      break;
    case 'gray':
      variantClasses = "bg-[#B5B5B5]";
      textClasses = "text-black";
      break;
  }

  const style = variant === 'image' ? { backgroundImage: "url('https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop')" } : {};

  return (
    <div className={`flex flex-col p-8 md:p-12 justify-between aspect-square md:aspect-[4/3] overflow-hidden border border-border ${variantClasses}`} style={style}>
      {overlay}
      <div className={`relative z-10 ${textClasses}`}>
        {studioName && (
          <h3 className="font-sans font-bold text-2xl md:text-3xl tracking-tight uppercase leading-none mb-6">{studioName}</h3>
        )}
        <p className="font-sans text-sm tracking-widest uppercase mb-2 opacity-90">Busca</p>
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight mb-2 leading-[1.1]">{role}</h2>
        <p className="font-sans italic text-sm tracking-widest opacity-80">{specialty}</p>
      </div>
      <div className={`relative z-10 flex items-center space-x-2 mt-8 ${textClasses}`}>
        <MapPin className="w-4 h-4" />
        <span className="font-sans text-sm tracking-wide">{location}</span>
      </div>
    </div>
  );
}

export default function ArtistasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Top container with inherited gray background from Home hero */}
      <div className="bg-[#D6D6D6]">
        <Navbar />

        {/* SECTION 1 - Hero */}
        <section className="pt-24 pb-32 px-4 md:px-8 w-full flex flex-col items-center text-center">
          <h1 className="font-serif text-5xl md:text-[8rem] tracking-tighter leading-[0.85] mb-8 uppercase max-w-5xl">
            ENCONTRÁ LOS MEJORES<br/>ESTUDIOS DONDE TRABAJAR.
          </h1>
          <p className="font-serif italic text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl">
            La plataforma donde podés postularte y encontrar tu próximo estudio.
          </p>
          <a 
            href="#ofertas" 
            className="bg-black text-white px-12 py-5 text-xs tracking-widest uppercase font-sans hover:bg-black/90 transition-colors inline-flex items-center justify-center"
          >
            Ver Ofertas &rarr;
          </a>
        </section>
      </div>

      {/* SECTION 2 - How it works */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h2 className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground text-center mb-20">
          Cómo Funciona
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          <div className="flex flex-col text-center md:text-left space-y-6">
            <span className="font-serif text-7xl tracking-tighter text-muted-foreground/30 leading-none">01</span>
            <div>
              <h3 className="font-sans text-sm font-bold tracking-[0.1em] uppercase mb-3">Explorá Ofertas</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Navegá el feed y filtrá por estilo, ubicación y modalidad de trabajo.
              </p>
            </div>
          </div>

          <div className="flex flex-col text-center md:text-left space-y-6">
            <span className="font-serif text-7xl tracking-tighter text-muted-foreground/30 leading-none">02</span>
            <div>
              <h3 className="font-sans text-sm font-bold tracking-[0.1em] uppercase mb-3">Postulate Directo</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Contactá al estudio por WhatsApp o Instagram desde la misma oferta.
              </p>
            </div>
          </div>

          <div className="flex flex-col text-center md:text-left space-y-6">
            <span className="font-serif text-7xl tracking-tighter text-muted-foreground/30 leading-none">03</span>
            <div>
              <h3 className="font-sans text-sm font-bold tracking-[0.1em] uppercase mb-3">Encontrá Tu Lugar</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Conectate con estudios que buscan exactamente tu perfil.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="w-full border-t border-border"></div>

      {/* SECTION 3 - Job listings */}
      <section id="ofertas" className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full bg-white">
        <div className="flex items-center justify-between mb-12 border-b border-border pb-4">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tighter font-bold uppercase">Puestos Vacantes</h2>
          <button className="flex items-center space-x-2 border border-black px-6 py-2 hover:bg-black/5 transition-colors">
            <span className="font-sans text-xs tracking-widest uppercase">Filtro</span>
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <JobCard 
            variant="white"
            studioName="BLACK PANTER"
            role="Tatuador/a"
            specialty="Realismo en black and grey"
            location="Palermo, Buenos Aires"
          />
          <JobCard 
            variant="dark"
            studioName="BLACK PANTER"
            role="Tatuador/a"
            specialty="Realismo en black and grey"
            location="Palermo, Buenos Aires"
          />
          <JobCard 
            variant="image"
            studioName=""
            role="Tatuador"
            specialty="Realismo en black and grey"
            location="Palermo, Buenos Aires"
          />
          <JobCard 
            variant="gray"
            studioName="BLACK PANTER"
            role="Tatuador/a"
            specialty="Realismo en black and grey"
            location="Palermo, Buenos Aires"
          />
        </div>

        <div className="flex justify-center">
          <button className="border border-black text-black px-12 py-4 text-xs tracking-widest uppercase font-sans hover:bg-black/5 transition-colors">
            Cargar Más
          </button>
        </div>
      </section>

      {/* SECTION 4 - Newsletter */}
      <section className="bg-white py-24 px-4 md:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">NO TE PIERDAS NADA</h2>
            <p className="font-sans text-muted-foreground text-sm max-w-md">
              Recibe las últimas ofertas de empleo y novedades del mundo del tattoo directamente en tu correo.
            </p>
          </div>
          <div>
            <form className="flex flex-col sm:flex-row border border-border">
              <input 
                type="email" 
                placeholder="nombre@ejemplo.com"
                className="flex-1 px-6 py-4 bg-transparent outline-none font-sans text-sm placeholder:text-muted-foreground focus:bg-gray-50 transition-colors"
                required
              />
              <button 
                type="submit" 
                className="border-l border-border px-8 py-4 text-xs tracking-widest uppercase font-sans hover:bg-muted transition-colors whitespace-nowrap bg-white text-black"
              >
                Suscribirme →
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
