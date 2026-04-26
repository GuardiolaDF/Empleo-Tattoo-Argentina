import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Settings2 } from "lucide-react";
import Link from "next/link";

// --- Components ---

const cardStyles = [
  { bg: "bg-[#FFFFFF]", text: "text-[#000000]", muted: "text-[#666666]" }, // Tone 1: white
  { bg: "bg-[#1A1A1A]", text: "text-[#FFFFFF]", muted: "text-white/80" },   // Tone 2: near black
  { bg: "bg-[#F0F0F0]", text: "text-[#000000]", muted: "text-[#666666]" }, // Tone 3: light gray
  { bg: "bg-[#2D2D2D]", text: "text-[#FFFFFF]", muted: "text-white/80" },   // Tone 4: dark gray
];

interface JobCardProps {
  index: number;
  studioName?: string;
  role: string;
  specialty: string;
  location: string;
}

function JobCard({ index, studioName, role, specialty, location }: JobCardProps) {
  const pattern = [0, 1, 1, 2];
  const style = cardStyles[pattern[index % 4]];

  return (
    <Link 
      href="/empleos/tatuador-blackwork" 
      className={`group block flex flex-col p-8 md:p-12 justify-between aspect-square md:aspect-[4/3] overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-xl ${style.bg} ${style.text}`} 
    >
      <div className="relative z-10">
        <h3 className="font-sans font-bold text-2xl md:text-3xl tracking-tight uppercase leading-none mb-6">{studioName}</h3>
        <p className={`font-sans text-sm tracking-widest uppercase mb-2 ${style.muted}`}>Busca</p>
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight mb-2 leading-[1.1]">{role}</h2>
        <p className={`font-sans italic text-sm tracking-widest ${style.muted}`}>{specialty}</p>
      </div>
      <div className="relative z-10 flex items-center space-x-2 mt-8">
        <MapPin className="w-4 h-4" />
        <span className="font-sans text-sm tracking-wide">{location}</span>
      </div>
    </Link>
  );
}

const brands = [
  "INK MASTER",
  "DRAGONFLY IRONS", 
  "CHEYENNE",
  "BISHOP ROTARY",
  "ETERNAL INK",
  "FK IRONS",
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#D6D6D6]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col items-start">
        <h1 className="font-serif text-7xl md:text-[9rem] tracking-tighter leading-[0.85] mb-8">
          EMPLEO<br/>TATTOO<br/>ARGENTINA
        </h1>
        <p className="font-serif italic text-xl md:text-2xl text-muted-foreground mb-12">
          Conectando artistas con los mejores estudios del país.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/publicar-empleo" className="bg-black text-white border border-black px-12 py-4 text-xs tracking-widest uppercase font-sans hover:bg-black/90 transition-colors w-full sm:w-auto text-center">
            Publicar
          </Link>
          <Link href="/buscar" className="bg-transparent text-black border border-black px-12 py-4 text-xs tracking-widest uppercase font-sans hover:bg-black/5 transition-colors w-full sm:w-auto text-center">
            Buscar
          </Link>
        </div>
      </section>

      {/* Logo Bar */}
      <section className="bg-white py-10 w-full border-y border-border overflow-hidden">
        <div style={{
          maskImage: 'linear-gradient(to right, transparent 0px, black 80px, black calc(100% - 80px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0px, black 80px, black calc(100% - 80px), transparent 100%)',
        }}>
          <div 
            className="flex whitespace-nowrap w-max hover:[animation-play-state:paused]"
            style={{ animation: "ticker 30s linear infinite" }}
          >
            {/* Double the array for seamless loop */}
            {[...brands, ...brands].map((brand, i) => (
              <div key={i} className="flex items-center">
                <span className="font-sans text-xs tracking-widest uppercase text-[#666666] px-8">
                  {brand}
                </span>
                <span className="text-[#666666]/50">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Puestos Vacantes (Job Grid) */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12 border-b border-black/10 pb-4">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tighter font-bold uppercase">Puestos Vacantes</h2>
          <button className="flex items-center space-x-2 border border-black px-6 py-2 hover:bg-black/5 transition-colors">
            <span className="font-sans text-xs tracking-widest uppercase">Filtro</span>
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { studioName: "BLACK PANTER", role: "Tatuador/a", specialty: "Realismo en black and grey", location: "Palermo, Buenos Aires" },
            { studioName: "BLACK PANTER", role: "Tatuador/a", specialty: "Realismo en black and grey", location: "Palermo, Buenos Aires" },
            { studioName: "VOID TATTOO CLUB", role: "Tatuador", specialty: "Realismo en black and grey", location: "Palermo, Buenos Aires" },
            { studioName: "BLACK PANTER", role: "Tatuador/a", specialty: "Realismo en black and grey", location: "Palermo, Buenos Aires" }
          ].map((job, idx) => (
            <JobCard 
              key={idx}
              index={idx}
              studioName={job.studioName}
              role={job.role}
              specialty={job.specialty}
              location={job.location}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <button className="border border-black text-black px-12 py-4 text-xs tracking-widest uppercase font-sans hover:bg-black/5 transition-colors">
            Cargar Más
          </button>
        </div>
      </section>

      {/* Newsletter */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
