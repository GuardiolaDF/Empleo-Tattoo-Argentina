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
import { NewsletterForm } from "@/components/ui/NewsletterForm";

// --- Components ---

const cardStyles = [
  { bg: "bg-card-1", text: "text-foreground", muted: "text-muted" }, // Tone 1: white
  { bg: "bg-card-2", text: "text-white", muted: "text-gray-400" },   // Tone 2: near black
  { bg: "bg-card-4", text: "text-white", muted: "text-gray-400" },   // Tone 4: dark gray
  { bg: "bg-card-3", text: "text-foreground", muted: "text-muted" }, // Tone 3: white
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
      className={`group flex flex-col p-6 sm:p-8 md:p-12 justify-between aspect-[3/4] sm:aspect-square md:aspect-[4/3] overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-card-hover transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] border border-border ${style.bg} ${style.text}`} 
    >
      <div className="relative z-10 flex flex-col">
        <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold uppercase leading-[0.8] tracking-tighter mb-6 sm:mb-12">{studioName}</h3>
        
        <div className="flex flex-col space-y-2">
          <span className={`text-label lowercase font-normal tracking-[0.2em] ${style.muted}`}>busca</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal leading-tight">{role}</h2>
          <span className={`text-base font-serif italic ${style.muted}`}>{specialty}</span>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col space-y-2 mt-6 sm:mt-12">
        <span className={`text-label lowercase font-normal tracking-[0.2em] ${style.muted}`}>en</span>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-sans font-normal">{location}</span>
        </div>
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

const ITEMS_PER_PAGE = 4;

export default function Home() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [filterBarOpen, setFilterBarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
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
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const removeFilter = (category: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[category];
    setActiveFilters(newFilters);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setVisibleCount(ITEMS_PER_PAGE);
  };

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

  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          // Mapeamos los datos de la base de datos al formato del frontend
          const mappedJobs = data.map((job: any) => {
            // Extraer info de la descripción: "Horario: ... | Experiencia: ... | Tipo de estudio: ..."
            const expMatch = job.description?.match(/Experiencia:\s*([^|]+)/);
            const tipoMatch = job.description?.match(/Tipo de estudio:\s*([^|]+)/);
            
            return {
              id: job._id,
              studioName: job.studioName,
              role: job.title,
              specialty: job.category,
              location: job.location,
              puesto: job.title,
              experiencia: expMatch ? expMatch[1].trim() : "Sin definir",
              especialidad: job.category,
              tipoEstudio: tipoMatch ? tipoMatch[1].trim() : "Privado",
              tipoRol: job.style,
              // La ubicación real para el filtro, la simplificamos por ahora a lo que diga location o "CABA" si no hay match
              ubicacion: job.location, 
            };
          });
          setJobs(mappedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    return Object.entries(activeFilters).every(([key, value]) => {
      // Para texto libre como ubicación, hacemos una búsqueda parcial para que los filtros funcionen mejor
      if (key === 'ubicacion') {
        return job[key]?.toLowerCase().includes(value.toLowerCase());
      }
      return job[key as keyof typeof job] === value;
    });
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col justify-center w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 min-h-[calc(100svh-var(--navbar-height))] md:min-h-[calc(100vh-var(--navbar-height))] py-12">
        <div className="flex flex-col items-start text-left">
          <h1 className="text-display-xl leading-[0.9] mb-6">
            EMPLEO<br/>TATTOO<br/>ARGENTINA
          </h1>
          <p className="text-subtitle text-muted-foreground leading-relaxed">
            Conectando artistas con los mejores estudios del país.
          </p>
        </div>
        <div className="flex flex-row justify-start gap-4 w-full mt-10">
          <Link href="/publicar-empleo" className="bg-black text-white border border-black px-12 py-4 text-button hover:opacity-90 transition-opacity duration-200 ease-editorial w-full sm:w-auto text-center">
            Publicar Aviso
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
            className="bg-transparent text-black border border-black px-12 py-4 text-button hover:bg-black/5 transition-colors duration-200 ease-editorial w-full sm:w-auto text-center"
          >
            BUSCAR EMPLEOS
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
                <span className="text-label text-muted-foreground px-8">
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
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-h2 uppercase">Puestos Vacantes</h2>
            <button 
              onClick={() => setFilterBarOpen(!filterBarOpen)}
              className="flex items-center space-x-2 border border-black px-4 sm:px-6 py-2 hover:bg-black/5 transition-colors duration-200 ease-editorial"
            >
              <span className="text-button-sm">Filtro</span>
              <Settings2 className="w-4 h-4" />
            </button>
          </div>

          {filterBarOpen && (
            <div 
              className="w-full bg-white relative z-20 animate-fade-in-up origin-top" 
              ref={dropdownRef}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b border-border">
                {Object.entries(FILTROS).map(([key, options]) => {
                  const isActive = !!activeFilters[key];
                  const isOpen = openDropdown === key;
                  const label = FILTER_LABELS[key];

                  return (
                    <div key={key} className="relative">
                      <button 
                        onClick={() => setOpenDropdown(isOpen ? null : key)}
                        className={`w-full flex items-center justify-between px-4 py-4 transition-colors duration-200 ease-editorial ${
                          isActive ? 'text-black font-medium' : 'text-muted-foreground hover:text-black font-normal'
                        }`}
                      >
                        <span className="text-label-sm truncate pr-2">{label}</span>
                        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ease-editorial ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                      </button>
                      {isOpen && (
                        <div className="absolute top-full mt-1 left-0 w-full min-w-[200px] bg-white shadow-dropdown max-h-[280px] overflow-y-auto z-50 animate-scale-in origin-top">
                          {options.map((opt) => {
                            const isSelected = activeFilters[key] === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => handleFilterSelect(key, opt)}
                                className={`w-full text-left px-4 py-2 text-body-sm transition-colors flex items-center justify-between ${
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
                 <button onClick={clearFilters} className="text-label-sm text-muted-foreground hover:text-black transition-colors whitespace-nowrap ml-4">
                  Limpiar Filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      {filteredJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 mt-10">
              {filteredJobs.slice(0, visibleCount).map((job, idx) => (
                <JobCard 
                  key={job.id || idx}
                  index={idx}
                  studioName={job.studioName}
                  role={job.role}
                  specialty={job.specialty}
                  location={job.location}
                />
              ))}
            </div>
            {visibleCount < filteredJobs.length && (
              <div className="flex justify-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="border border-black text-black px-12 py-4 text-button hover:bg-black/5 transition-colors"
                >
                  Cargar Más
                </button>
              </div>
            )}
          </>
        ) : (
           <div className="py-24 flex flex-col items-center justify-center text-center">
            <p className="text-body-sm text-muted-foreground mb-4">No hay ofertas que coincidan con tu búsqueda.</p>
            <button onClick={clearFilters} className="text-button-sm border-b border-black text-black hover:text-black/70 transition-colors pb-1">
              LIMPIAR FILTROS
            </button>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-white py-24 px-4 md:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div>
            <h2 className="text-h2 mb-4">NO TE PIERDAS NADA</h2>
            <p className="text-body-sm text-muted-foreground max-w-md">
              Recibe las últimas ofertas de empleo y novedades del mundo del tattoo directamente en tu correo.
            </p>
          </div>
          <div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
