"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Zod Schema
const jobPostingSchema = z.object({
  nombreEstudio: z.string().min(1, "El nombre del estudio es requerido"),
  localizacion: z.string().min(1, "La localización es requerida"),
  tipoEstudio: z.string().min(1, "Selecciona un tipo de estudio"),
  modoTrabajo: z.string().min(1, "Selecciona un modo de trabajo"),
  puesto: z.string().min(1, "Selecciona un puesto"),
  experiencia: z.string().min(1, "Selecciona un nivel de experiencia"),
  especialidades: z.string().min(1, "Las especialidades son requeridas"),
  horario: z.string().min(1, "El horario es requerido"),
});

type JobPostingFormValues = z.infer<typeof jobPostingSchema>;

export default function PublicarEmpleoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingSchema),
  });

  const onSubmit = (data: JobPostingFormValues) => {
    console.log("Form data:", data);
    alert("Formulario válido. Integración de Mercado Pago pendiente.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-16 lg:gap-32">
        
        {/* Left Column: Title */}
        <div className="top-16 self-start sticky">
          <h1 className="font-serif text-5xl md:text-7xl tracking-tighter leading-none mb-6">
            Publicar<br/>un Empleo
          </h1>
          <p className="font-sans text-sm text-muted-foreground max-w-sm">
            Publica tu vacante en la red más curada de profesionales del tatuaje.
          </p>
        </div>

        {/* Right Column: Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          
          {/* Section 01 */}
          <section className="space-y-8">
            <h2 className="font-serif text-3xl tracking-tight border-b border-border pb-4">
              01. Datos del Estudio
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Nombre del Estudio</label>
                <input 
                  {...register("nombreEstudio")}
                  placeholder="Ej. Black Lung Studio"
                  className={`border ${errors.nombreEstudio ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors`}
                />
                {errors.nombreEstudio && <span className="font-sans text-[10px] text-red-500">{errors.nombreEstudio.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Localización (Ciudad - Barrio, Calle y Altura)</label>
                <input 
                  {...register("localizacion")}
                  placeholder="Ej. Madrid - Malasaña, Calle Pez 12"
                  className={`border ${errors.localizacion ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors`}
                />
                {errors.localizacion && <span className="font-sans text-[10px] text-red-500">{errors.localizacion.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Tipo de Estudio</label>
                <select 
                  {...register("tipoEstudio")}
                  className={`border ${errors.tipoEstudio ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white appearance-none`}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="privado">Privado / A puerta cerrada</option>
                  <option value="comercial">A pie de calle</option>
                </select>
                {errors.tipoEstudio && <span className="font-sans text-[10px] text-red-500">{errors.tipoEstudio.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Modo de Trabajo</label>
                <select 
                  {...register("modoTrabajo")}
                  className={`border ${errors.modoTrabajo ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white appearance-none`}
                >
                  <option value="">Seleccionar modo</option>
                  <option value="porcentaje">Porcentaje</option>
                  <option value="alquiler">Alquiler de silla/espacio</option>
                  <option value="fijo">Sueldo fijo</option>
                </select>
                {errors.modoTrabajo && <span className="font-sans text-[10px] text-red-500">{errors.modoTrabajo.message}</span>}
              </div>
            </div>
          </section>

          {/* Section 02 */}
          <section className="space-y-8">
            <h2 className="font-serif text-3xl tracking-tight border-b border-border pb-4">
              02. Datos del Rol
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Puesto</label>
                <select 
                  {...register("puesto")}
                  className={`border ${errors.puesto ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white appearance-none`}
                >
                  <option value="">Seleccionar puesto</option>
                  <option value="tatuador">Tatuador/a</option>
                  <option value="perforador">Perforador/a (Piercer)</option>
                  <option value="manager">Shop Manager</option>
                </select>
                {errors.puesto && <span className="font-sans text-[10px] text-red-500">{errors.puesto.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Experiencia</label>
                <select 
                  {...register("experiencia")}
                  className={`border ${errors.experiencia ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white appearance-none`}
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="junior">Junior (1-3 años)</option>
                  <option value="mid">Mid (3-5 años)</option>
                  <option value="senior">Senior (+5 años)</option>
                </select>
                {errors.experiencia && <span className="font-sans text-[10px] text-red-500">{errors.experiencia.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Especialidades</label>
                <input 
                  {...register("especialidades")}
                  placeholder="Ej. Blackwork, Tradicional..."
                  className={`border ${errors.especialidades ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors`}
                />
                {errors.especialidades && <span className="font-sans text-[10px] text-red-500">{errors.especialidades.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Horario</label>
                <input 
                  {...register("horario")}
                  placeholder="Ej. Lunes a Viernes, 10:00 - 18:00"
                  className={`border ${errors.horario ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors`}
                />
                {errors.horario && <span className="font-sans text-[10px] text-red-500">{errors.horario.message}</span>}
              </div>
            </div>
          </section>

          {/* Section 03 */}
          <section className="bg-muted p-8 md:p-12 space-y-8">
            <div className="flex justify-between items-center pb-6">
              <div>
                <h2 className="font-serif text-3xl tracking-tight mb-2">03. Publicar</h2>
                <p className="font-sans text-xs text-muted-foreground">Publicación activa por 30 días. Incluye mención en newsletter.</p>
              </div>
              <div className="text-right">
                <h3 className="font-serif text-5xl tracking-tighter leading-none">$150</h3>
                <span className="font-sans text-[10px] tracking-widest font-bold uppercase text-foreground">USD</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-black text-white py-5 flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <span className="font-sans text-xs tracking-widest uppercase">Pagar con Mercado Pago</span>
            </button>
          </section>

        </form>
      </main>

      <Footer />
    </div>
  );
}
