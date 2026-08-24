"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Settings2, Check, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { SpecialtyPill } from "@/components/ui/SpecialtyPill";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { JobCard } from "@/components/ui/JobCard";

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

const ITEMS_PER_PAGE = 9;

function EmpleosCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      if (key in FILTROS) {
        initial[key] = val;
      }
    });
    return initial;
  });

  const [filterBarOpen, setFilterBarOpen] = useState(() => Object.keys(activeFilters).length > 0);
  const [jobs, setJobs] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      if (key in FILTROS) {
        current[key] = val;
      }
    });
    setActiveFilters(current);
    if (Object.keys(current).length > 0) {
      setFilterBarOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          const jobsList = Array.isArray(data) ? data : (data.jobs || []);
          const mappedJobs = jobsList.map((job: any) => {
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

  const updateUrlFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      }
    });
    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath, { scroll: false });
  };

  const handleFilterSelect = (category: string, value: string) => {
    const newFilters = { ...activeFilters, [category]: value };
    setActiveFilters(newFilters);
    updateUrlFilters(newFilters);
    setOpenDropdown(null);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const removeFilter = (category: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[category];
    setActiveFilters(newFilters);
    updateUrlFilters(newFilters);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    setActiveFilters({});
    updateUrlFilters({});
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const filteredJobs = jobs.filter(job => {
    return Object.entries(activeFilters).every(([key, value]) => {
      if (key === 'ubicacion') {
        return job[key]?.toLowerCase().includes(value.toLowerCase());
      }
      return job[key as keyof typeof job] === value;
    });
  });

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Bolsa de Empleos de Tatuaje en Argentina",
    "description": "Lista de ofertas activas para tatuadores, perforadores y profesionales de estudios en Argentina.",
    "numberOfItems": filteredJobs.length,
    "itemListElement": visibleJobs.map((job, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": `${job.role} - ${job.studioName}`,
      "url": `https://empleotattoo.com.ar/empleos/${job.id}`
    }))
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />
      <div className="bg-gray-50 border-b border-border">
        <Navbar />

        {/* Hero Section */}
        <section className="flex flex-col justify-center w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="flex flex-col items-start text-left w-full">
            <span className="text-label-sm text-muted-foreground uppercase tracking-widest mb-4">Directorio Oficial</span>
            <h1 className="text-display-xl leading-[0.9] mb-6 uppercase max-w-none">
              Ofertas de Empleo<br /> del Mundo Tattoo
            </h1>
            <p className="text-subtitle text-muted-foreground leading-relaxed max-w-2xl">
              Explorá las búsquedas laborales de estudios de tatuaje y piercing en toda Argentina.
            </p>
          </div>
        </section>
      </div>

      {/* Main Catalog Feed */}
      <div className="w-full bg-gray-50 flex-1">
        <section id="ofertas" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 uppercase">Puestos Vacantes ({filteredJobs.length})</h2>
              <button 
                onClick={() => setFilterBarOpen(!filterBarOpen)}
                className="flex items-center space-x-2 border border-black px-4 sm:px-6 py-2 hover:bg-black/5 transition-colors"
              >
                <span className="text-button-sm">Filtro</span>
                <Settings2 className="w-4 h-4" />
              </button>
            </div>

            {filterBarOpen && (
              <div 
                className="w-full bg-white relative z-20 mt-6 border border-border shadow-sm origin-top" 
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
                          className={`w-full flex items-center justify-between px-4 py-4 transition-colors ${
                            isActive ? 'text-black font-medium' : 'text-muted-foreground hover:text-black font-normal'
                          }`}
                        >
                          <span className="text-label-sm truncate pr-2">{label}</span>
                          <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                        </button>
                        {isOpen && (
                          <div className="absolute top-full mt-1 left-0 w-full min-w-[200px] bg-white shadow-dropdown max-h-[280px] overflow-y-auto z-50">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                {visibleJobs.map((job, idx) => (
                  <Link key={job.id || idx} href={`/empleos/${job.id}`}>
                    <JobCard 
                      jobId={job.id}
                      index={idx}
                      studioName={job.studioName}
                      role={job.role}
                      specialty={job.specialty}
                      location={job.location}
                      metadata={[job.tipoRol, job.experiencia].filter(Boolean)}
                    />
                  </Link>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                    className="border border-black bg-black text-white px-12 py-4 text-button hover:bg-black/90 transition-colors shadow-sm"
                  >
                    Cargar Más Ofertas
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-border">
              <p className="text-body-sm text-muted-foreground mb-4">No hay ofertas que coincidan con tu búsqueda.</p>
              <button onClick={clearFilters} className="text-button-sm border-b border-black text-black hover:text-black/70 transition-colors pb-1">
                LIMPIAR FILTROS
              </button>
            </div>
          )}
        </section>
      </div>

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

      <Footer />
    </div>
  );
}

export default function EmpleosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-body text-muted-foreground">Cargando catálogo...</p></div>}>
      <EmpleosCatalogContent />
    </Suspense>
  );
}
