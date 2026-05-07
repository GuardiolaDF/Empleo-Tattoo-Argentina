"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Settings2, Check, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { SpecialtyPill } from "@/components/ui/SpecialtyPill";

const cardStyles = [
  { bg: "bg-card-1", text: "text-foreground", muted: "text-muted" }, // Tone 1: white
  { bg: "bg-card-2", text: "text-white", muted: "text-gray-400" },   // Tone 2: near black
  { bg: "bg-card-4", text: "text-white", muted: "text-gray-400" },   // Tone 4: dark gray
  { bg: "bg-card-3", text: "text-foreground", muted: "text-muted" }, // Tone 3: white
];

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
      className={`group flex flex-col p-8 md:p-12 justify-between aspect-square md:aspect-[4/3] overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-card-hover border border-border ${style.bg} ${style.text}`} 
    >
      <div className="relative z-10 flex flex-col">
        <h3 className="text-6xl md:text-7xl font-sans font-bold uppercase leading-[0.8] tracking-tighter mb-12">{studioName}</h3>
        
        <div className="flex flex-col space-y-2">
          <span className={`text-label lowercase font-normal tracking-[0.2em] ${style.muted}`}>busca</span>
          <h2 className="text-4xl font-serif font-normal leading-tight">{role}</h2>
          <span className={`text-base font-serif italic ${style.muted}`}>{specialty}</span>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col space-y-2 mt-12">
        <span className={`text-label lowercase font-normal tracking-[0.2em] ${style.muted}`}>en</span>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-sans font-normal">{location}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ArtistasPage() {
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
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Top container with inherited gray background from Home hero */}
      <div className="bg-gray-50">
        <Navbar />

        {/* SECTION 1 - Hero */}
        <section className="flex flex-col justify-center w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 min-h-[calc(100svh-var(--navbar-height))] md:min-h-[calc(100vh-var(--navbar-height))] py-12">
          <div className="flex flex-col items-start text-left w-full">
            <h1 className="text-display-xl leading-[0.9] mb-6 max-w-none uppercase">
              Tu próximo estudio<br className="hidden md:block" /> te está esperando.
            </h1>
            <p className="text-subtitle text-muted-foreground leading-relaxed max-w-2xl">
              La plataforma donde podés postularte y encontrar tu próximo estudio.
            </p>
          </div>
          <div className="flex flex-row justify-start gap-4 w-full mt-10">
            <a 
              href="#ofertas" 
              className="bg-black text-white px-12 py-5 text-button hover:bg-black/90 transition-colors inline-flex items-center justify-center"
            >
              Ver Ofertas &rarr;
            </a>
          </div>
        </section>
      </div>

      {/* SECTION 2 - How it works */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h2 className="text-label text-center mb-20">
          Cómo Funciona
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          <div className="flex flex-col text-center md:text-left space-y-6">
            <span className="text-display-lg text-muted-foreground/30">01</span>
            <div>
              <h3 className="text-label mb-3">Explorá Ofertas</h3>
              <p className="text-body-sm text-muted-foreground">
                Navegá el feed y filtrá por estilo, ubicación y modalidad de trabajo.
              </p>
            </div>
          </div>

          <div className="flex flex-col text-center md:text-left space-y-6">
            <span className="text-display-lg text-muted-foreground/30">02</span>
            <div>
              <h3 className="text-label mb-3">Postulate Directo</h3>
              <p className="text-body-sm text-muted-foreground">
                Contactá al estudio por WhatsApp o Instagram desde la misma oferta.
              </p>
            </div>
          </div>

          <div className="flex flex-col text-center md:text-left space-y-6">
            <span className="text-display-lg text-muted-foreground/30">03</span>
            <div>
              <h3 className="text-label mb-3">Encontrá Tu Lugar</h3>
              <p className="text-body-sm text-muted-foreground">
                Conectate con estudios que buscan exactamente tu perfil.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="w-full border-t border-border"></div>

      {/* SECTION 3 - Job listings */}
      <div className="w-full bg-gray-50">
        <section id="ofertas" className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <style>{`
          @keyframes filterSlideIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div className="flex flex-col mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-h2 uppercase">Puestos Vacantes</h2>
            <button 
              onClick={() => setFilterBarOpen(!filterBarOpen)}
              className="flex items-center space-x-2 border border-black px-6 py-2 hover:bg-black/5 transition-colors hidden md:flex"
            >
              <span className="text-button-sm">Filtro</span>
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
                        <span className="text-label-sm truncate pr-2">{label}</span>
                        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ease ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                      </button>
                      {isOpen && (
                        <div className="absolute top-full left-0 w-full min-w-[200px] bg-white shadow-dropdown max-h-[280px] overflow-y-auto z-30">
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
              <button className="border border-black text-black px-12 py-4 text-button hover:bg-black/5 transition-colors">
                Cargar Más
              </button>
            </div>
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
      </div>

      {/* SECTION 4 - Newsletter */}
      <section className="bg-white py-24 px-4 md:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-h2 mb-4">NO TE PIERDAS NADA</h2>
            <p className="text-body-sm text-muted-foreground max-w-md">
              Recibe las últimas ofertas de empleo y novedades del mundo del tattoo directamente en tu correo.
            </p>
          </div>
          <div>
            <form className="flex flex-col sm:flex-row border border-border">
              <input 
                type="email" 
                placeholder="nombre@ejemplo.com"
                className="flex-1 px-6 py-4 bg-transparent outline-none text-body placeholder:text-muted-foreground focus:bg-gray-50 transition-colors"
                required
              />
              <button 
                type="submit" 
                className="border-l border-border px-8 py-4 text-button hover:bg-muted transition-colors whitespace-nowrap bg-white text-black"
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
