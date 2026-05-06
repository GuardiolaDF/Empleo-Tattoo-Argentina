"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Settings2, Check, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { SpecialtyPill } from "@/components/ui/SpecialtyPill";

// --- Components ---

const cardStyles = [
  { bg: "bg-card-1", text: "text-foreground", muted: "text-muted-foreground" }, // Tone 1: white
  { bg: "bg-card-2", text: "text-background", muted: "text-white/80" },   // Tone 2: near black
  { bg: "bg-card-4", text: "text-background", muted: "text-white/80" },   // Tone 4: dark gray
  { bg: "bg-card-3", text: "text-foreground", muted: "text-muted-foreground" }, // Tone 3: white
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

const FILTROS = {
  puesto: ["Tatuador/a", "Perforador/a", "Recepcionista", 
    "Encargado/a de local", "Mantenimiento"],
  experiencia: ["Sin experiencia", "Intermedio (1-3 años)", 
    "Avanzado (3-5 años)", "Senior (+5 años)"],
  especialidad: ["Blackwork", "Realismo", "Traditional", 
    "Neo Traditional", "Japonés", "Geométrico", "Fineline", 
    "Dotwork", "Acuarela", "Lettering", "Cover up", 
    "Generalista", "Comercial", "Otro"],
  tipoEstudio: ["Privado", "Local comercial"],
  tipoRol: ["Alquiler de box", "Residente con porcentaje", 
    "Residente clientes propios"],
  ubicacion: ["CABA", "Zona Norte GBA", "Zona Sur GBA", 
    "Zona Oeste GBA", "Buenos Aires provincia", "Córdoba", 
    "Rosario", "Mendoza", "Tucumán", "Salta", "Jujuy",
    "Santiago del Estero", "Chaco", "Corrientes", "Misiones",
    "Entre Ríos", "Santa Fe", "La Rioja", "Catamarca",
    "San Juan", "San Luis", "La Pampa", "Neuquén",
    "Río Negro", "Chubut", "Santa Cruz", 
    "Tierra del Fuego", "Islas Malvinas"],
};

const FILTER_LABELS: Record<string, string> = {
  puesto: "PUESTO",
  experiencia: "EXPERIENCIA",
  especialidad: "ESPECIALIDAD",
  tipoEstudio: "TIPO DE ESTUDIO",
  tipoRol: "TIPO DE ROL",
  ubicacion: "UBICACIÓN"
};

const brands = [
  "INK MASTER",
  "DRAGONFLY IRONS", 
  "CHEYENNE",
  "BISHOP ROTARY",
  "ETERNAL INK",
  "FK IRONS",
];

const newsletterSchema = z.object({
  email: z.string()
    .min(1, "Ingresá tu email")
    .email("Ingresá un email válido. Ej: nombre@ejemplo.com"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function Home() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [filterBarOpen, setFilterBarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterSelect = (category: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [category]: value }));
    setOpenDropdown(null);
  };

  const removeFilter = (category: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[category];
    setActiveFilters(newFilters);
  };

  const clearFilters = () => setActiveFilters({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    mode: "onChange",
    defaultValues: { email: "" }
  });
  
  const emailValue = watch("email");

  const onSubmit = (data: NewsletterFormValues) => {
    setIsSubscribed(true);
  };

  const allJobs = [
    { studioName: "BLACK PANTER", role: "Tatuador/a", specialty: "Realismo", location: "Palermo, Buenos Aires", puesto: "Tatuador/a", experiencia: "Intermedio (1-3 años)", especialidad: "Realismo", tipoEstudio: "Privado", tipoRol: "Residente con porcentaje", ubicacion: "CABA" },
    { studioName: "BLACK PANTER", role: "Tatuador/a", specialty: "Blackwork", location: "Palermo, Buenos Aires", puesto: "Tatuador/a", experiencia: "Avanzado (3-5 años)", especialidad: "Blackwork", tipoEstudio: "Privado", tipoRol: "Residente con porcentaje", ubicacion: "CABA" },
    { studioName: "VOID TATTOO CLUB", role: "Tatuador", specialty: "Dotwork", location: "Palermo, Buenos Aires", puesto: "Tatuador/a", experiencia: "Senior (+5 años)", especialidad: "Dotwork", tipoEstudio: "Privado", tipoRol: "Alquiler de box", ubicacion: "CABA" },
    { studioName: "BLACK PANTER", role: "Tatuador/a", specialty: "Fineline", location: "Palermo, Buenos Aires", puesto: "Tatuador/a", experiencia: "Intermedio (1-3 años)", especialidad: "Fineline", tipoEstudio: "Privado", tipoRol: "Residente con porcentaje", ubicacion: "CABA" }
  ];

  const filteredJobs = allJobs.filter(job => {
    return Object.entries(activeFilters).every(([key, value]) => {
      return job[key as keyof typeof job] === value;
    });
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
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
          <a 
            href="#ofertas"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('ofertas')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="bg-transparent text-black border border-black px-12 py-4 text-xs tracking-widest uppercase font-sans hover:bg-black/5 transition-colors w-full sm:w-auto text-center"
          >
            BUSCAR
          </a>
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
            {/* Quadruple the array for seamless loop on ultra-wide screens */}
            {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
              <div key={i} className="flex items-center">
                <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground px-8">
                  {brand}
                </span>
                <span className="mx-6 text-muted">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Puestos Vacantes (Job Grid) */}
      <section id="ofertas" className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <style>{`
          @keyframes filterSlideIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div className="flex flex-col mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tighter font-bold uppercase">Puestos Vacantes</h2>
            <button 
              onClick={() => setFilterBarOpen(!filterBarOpen)}
              className="flex items-center space-x-2 border border-black px-6 py-2 hover:bg-black/5 transition-colors hidden md:flex"
            >
              <span className="font-sans text-xs tracking-widest uppercase">Filtro</span>
              <Settings2 className="w-4 h-4" />
            </button>
          </div>

          {filterBarOpen && (
            <div 
              className="w-full bg-white relative z-20" 
              ref={dropdownRef}
              style={{ animation: 'filterSlideIn 300ms ease-out forwards' }}
            >
              <div className="grid grid-cols-2 md:grid-cols-6 border-b border-border">
                {Object.entries(FILTROS).map(([key, options]) => {
                  const isActive = !!activeFilters[key];
                  const isOpen = openDropdown === key;
                  const label = FILTER_LABELS[key];

                  return (
                    <div key={key} className="relative">
                      <button 
                        onClick={() => setOpenDropdown(isOpen ? null : key)}
                        className={`w-full flex items-center justify-between px-4 py-4 transition-colors ${
                          isActive ? 'text-black font-medium' : 'text-muted-foreground hover:text-black font-normal'
                        }`}
                      >
                        <span className="font-sans text-[10px] tracking-widest uppercase truncate pr-2">{label}</span>
                        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ease ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                      </button>
                      {isOpen && (
                        <div className="absolute top-full left-0 w-full min-w-[200px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] max-h-[280px] overflow-y-auto z-30">
                          {options.map((opt) => {
                            const isSelected = activeFilters[key] === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => handleFilterSelect(key, opt)}
                                className={`w-full text-left px-4 py-2 font-sans text-xs transition-colors flex items-center justify-between ${
                                  isSelected ? 'bg-gray-50 font-medium' : 'bg-white hover:bg-gray-50 font-normal'
                                }`}
                              >
                                <span className="text-black">{opt}</span>
                                {isSelected && <Check className="w-4 h-4 text-black" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {Object.keys(activeFilters).length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([key, value]) => (
                    <div key={key} className="flex items-center bg-black text-white border border-black group cursor-pointer" onClick={() => removeFilter(key)}>
                      <SpecialtyPill label={`${FILTER_LABELS[key]}: ${value}`} variant="default" />
                      <span className="pr-3 text-white/50 group-hover:text-white transition-colors">
                        <X className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
                <button onClick={clearFilters} className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground hover:text-black transition-colors whitespace-nowrap ml-4">
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {filteredJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {filteredJobs.map((job, idx) => (
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
          </>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <p className="font-sans text-sm text-muted-foreground mb-4">No hay ofertas que coincidan con tu búsqueda.</p>
            <button onClick={clearFilters} className="font-sans text-xs tracking-widest uppercase border-b border-black text-black hover:text-black/70 transition-colors pb-1">
              LIMPIAR FILTROS
            </button>
          </div>
        )}
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
            {isSubscribed ? (
              <p className="font-serif italic text-sm text-black">
                ¡Listo! Te avisamos cuando haya novedades.
              </p>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <div className={`flex flex-col sm:flex-row border ${errors.email ? 'border-red-500' : 'border-border'}`}>
                  <div className="relative flex-1">
                    <input 
                      {...register("email")}
                      placeholder="nombre@ejemplo.com"
                      className="w-full px-6 py-4 bg-transparent outline-none font-sans text-sm placeholder:text-muted-foreground focus:bg-gray-50 transition-colors pr-12"
                    />
                    {emailValue && !errors.email && (
                      <Check className="w-4 h-4 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <button 
                    type="submit" 
                    disabled={!isValid || !emailValue}
                    className={`border-l ${errors.email ? 'border-red-500' : 'border-border'} px-8 py-4 text-xs tracking-widest uppercase font-sans transition-colors whitespace-nowrap ${
                      isValid && emailValue
                        ? 'bg-black text-white hover:bg-black/90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    SUSCRIBIRSE →
                  </button>
                </div>
                {errors.email && (
                  <span className="font-sans text-[10px] text-red-500 mt-2">{errors.email.message}</span>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
