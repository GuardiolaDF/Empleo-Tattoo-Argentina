"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Settings2, Check, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { SpecialtyPill } from "@/components/ui/SpecialtyPill";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { JobCard } from "@/components/ui/JobCard";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring" as const, stiffness: 100, damping: 20 }
  }
};

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

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isSubscribed, setIsSubscribed] = useState(false);
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
          const jobsList = Array.isArray(data) ? data : (data.jobs || []);
          // Mapeamos los datos de la base de datos al formato del frontend
          const mappedJobs = jobsList.map((job: any) => {

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
    <main className="flex flex-col min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Empleo Tattoo Argentina",
            "url": "https://empleotattoo.com.ar",
            "description": "Directorio de empleos para estudios de tatuaje en Argentina.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://empleotattoo.com.ar/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <Navbar />
      <section className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 min-h-[calc(100svh-var(--navbar-height))] md:min-h-[calc(100vh-var(--navbar-height))] py-12 gap-12">
        {/* Columna Izquierda: Título y CTAs */}
        <motion.div 
          className="flex flex-col items-start text-left max-w-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-display-xl leading-[0.9] mb-6 uppercase"
          >
            EMPLEO<br/>TATTOO<br/>ARGENTINA
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-subtitle text-muted-foreground leading-relaxed mb-8"
          >
            Conectando artistas con los mejores estudios del país.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/publicar-empleo" className="bg-black text-white border border-black px-10 py-4 text-button hover:bg-black/90 transition-colors duration-200 ease-editorial w-full sm:w-auto text-center shadow-md">
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
              className="bg-transparent text-black border border-black px-10 py-4 text-button hover:bg-black/5 transition-colors duration-200 ease-editorial w-full sm:w-auto text-center"
            >
              BUSCAR EMPLEOS
            </a>
          </motion.div>
        </motion.div>

        {/* Columna Derecha: Tarjeta Promocional de Lanzamiento */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-auto"
        >
          <div className="bg-white border-2 border-black p-8 md:p-10 max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
            <div className="inline-flex items-center space-x-2 bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 rounded-full">
              <span>🔥 LANZAMIENTO OFICIAL — 75% OFF</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-3 text-black leading-tight">
              OFERTA ESPECIAL DE BIENVENIDA
            </h3>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Aprovechá la tarifa promocional para publicar tu búsqueda de tatuadores, perforadores o staff del estudio.
            </p>

            <div className="flex items-baseline space-x-3 mb-6 border-t border-border pt-4">
              <span className="text-muted-foreground line-through text-lg">$ 20.000</span>
              <span className="text-4xl font-black text-black">$ 5.000</span>
              <span className="text-xs text-muted-foreground font-semibold uppercase">ARS</span>
            </div>

            <Link 
              href="/publicar-empleo"
              className="w-full bg-black text-white py-4 px-6 flex items-center justify-center space-x-2 font-bold uppercase text-xs sm:text-sm hover:bg-black/90 transition-colors shadow-sm tracking-wider"
            >
              <span>PUBLICAR AHORA CON DESCUENTO</span>
            </Link>
          </div>
        </motion.div>
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

          <AnimatePresence>
            {filterBarOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-white relative z-20 origin-top overflow-hidden" 
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
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full mt-1 left-0 w-full min-w-[200px] bg-white shadow-dropdown max-h-[280px] overflow-y-auto z-50 origin-top"
                            >
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
                            </motion.div>
                          )}
                        </AnimatePresence>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      {filteredJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 mt-10">
              {filteredJobs.slice(0, visibleCount).map((job, idx) => (
                <Link key={job.id || idx} href={`/empleos/${job.id}`}>
                  <JobCard 
                    index={idx}
                    jobId={job.id}
                    studioName={job.studioName}
                    role={job.role}
                    specialty={job.specialty}
                    location={job.location}
                  />
                </Link>
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
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-body text-muted-foreground">Cargando empleos...</p></div>}>
      <HomeContent />
    </Suspense>
  );
}
