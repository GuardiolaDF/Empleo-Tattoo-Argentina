"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

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
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingSchema),
  });

  const onSubmit = async (data: JobPostingFormValues, e?: React.BaseSyntheticEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.puesto,
        studioName: data.nombreEstudio,
        location: data.localizacion,
        description: `Horario: ${data.horario} | Experiencia: ${data.experiencia} | Tipo de estudio: ${data.tipoEstudio}`,
        category: data.especialidades,
        style: data.modoTrabajo, // Reutilizando el schema propuesto
      };

      console.log("Datos a enviar:", payload);

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error API Jobs:", errorData);
        alert("Hubo un error al guardar tu publicación. Revisa la consola.");
        return;
      }

      const responseData = await res.json();
      if (responseData.id) {
        router.push(`/checkout/${responseData.id}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Error de red al procesar tu solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* <Navbar /> */}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-16 lg:gap-32">

        {/* Left Column: Title */}
        <div className="lg:top-32 self-start lg:sticky z-10 bg-white pb-4 lg:pb-0">
          <button onClick={() => router.back()} className="inline-flex items-center space-x-2 text-muted-foreground hover:text-black transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-nav">Volver</span>
          </button>
          <h1 className="text-display-lg lg:text-display-xl mb-6">
            Publicar<br />un Aviso
          </h1>
          <p className="text-body-sm text-muted-foreground max-w-sm">
            Publica tu vacante en la red más curada de profesionales del tatuaje.
          </p>
        </div>

        {/* Right Column: Form */}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Section 01 */}
          <section className="space-y-8">
            <h2 className="text-h2 border-b border-border pb-4">
              01. Datos del Estudio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="flex flex-col space-y-2">
                <label className="text-label-sm text-muted-foreground">Nombre del Estudio</label>
                <input
                  {...register("nombreEstudio")}
                  placeholder="Ej. Black Lung Studio"
                  className={`border ${errors.nombreEstudio ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors`}
                />
                {errors.nombreEstudio && <span className="text-caption-sm text-red-500">{errors.nombreEstudio.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-label-sm text-muted-foreground">Localización (Ciudad - Barrio, Calle y Altura)</label>
                <input
                  {...register("localizacion")}
                  placeholder="Ej. Madrid - Malasaña, Calle Pez 12"
                  className={`border ${errors.localizacion ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors`}
                />
                {errors.localizacion && <span className="text-caption-sm text-red-500">{errors.localizacion.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-label-sm text-muted-foreground">Tipo de Estudio</label>
                <select
                  {...register("tipoEstudio")}
                  className={`border ${errors.tipoEstudio ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white appearance-none`}
                >
                  <option value="" disabled>Seleccionar tipo</option>
                  <option value="Estudio privado">Estudio privado</option>
                  <option value="Local a la calle">Local a la calle</option>
                </select>
                {errors.tipoEstudio && <span className="text-caption-sm text-red-500">{errors.tipoEstudio.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-label-sm text-muted-foreground">Modo de Trabajo</label>
                <select
                  {...register("modoTrabajo")}
                  className={`border ${errors.modoTrabajo ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white appearance-none`}
                >
                  <option value="" disabled>Seleccionar modo</option>
                  <option value="A porcentaje">A porcentaje</option>
                  <option value="Alquiler de box">Alquiler de box</option>
                  <option value="Porcentaje con clientes propios">Porcentaje con clientes propios</option>
                </select>
                {errors.modoTrabajo && <span className="text-caption-sm text-red-500">{errors.modoTrabajo.message}</span>}
              </div>
            </div>
          </section>

          {/* Section 02 */}
          <section className="space-y-8">
            <h2 className="text-h2 border-b border-border pb-4">
              02. Datos del Rol
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="flex flex-col space-y-2">
                <label className="text-label-sm text-muted-foreground">Puesto</label>
                <select
                  {...register("puesto")}
                  className={`border ${errors.puesto ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white appearance-none`}
                >
                  <option value="" disabled>Seleccionar puesto</option>
                  <option value="Tatuador/a">Tatuador/a</option>
                  <option value="Perforador/a">Perforador/a</option>
                  <option value="Recepcionista">Recepcionista</option>
                  <option value="Encargado/a">Encargado/a</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
                {errors.puesto && <span className="text-caption-sm text-red-500">{errors.puesto.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-label-sm text-muted-foreground">Experiencia</label>
                <select
                  {...register("experiencia")}
                  className={`border ${errors.experiencia ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white appearance-none`}
                >
                  <option value="" disabled>Seleccionar nivel</option>
                  <option value="Aprendiz (0-1 años)">Aprendiz (0-1 años)</option>
                  <option value="Junior (1-3 años)">Junior (1-3 años)</option>
                  <option value="Mid (3-5 años)">Mid (3-5 años)</option>
                  <option value="Senior (+5 años)">Senior (+5 años)</option>
                </select>
                {errors.experiencia && <span className="text-caption-sm text-red-500">{errors.experiencia.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-label-sm text-muted-foreground">Especialidades</label>
                <select
                  {...register("especialidades")}
                  className={`border ${errors.especialidades ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white appearance-none`}
                >
                  <option value="" disabled>Seleccionar especialidad</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Generalista">Generalista</option>
                  <option value="Blackwork">Blackwork</option>
                  <option value="Realismo">Realismo</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Neo Traditional">Neo Traditional</option>
                  <option value="Japonés">Japonés</option>
                  <option value="Geométrico">Geométrico</option>
                  <option value="Fineline">Fineline</option>
                  <option value="Dotwork">Dotwork</option>
                  <option value="Acuarela">Acuarela</option>
                  <option value="Lettering">Lettering</option>
                  <option value="Cover up">Cover up</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.especialidades && <span className="text-caption-sm text-red-500">{errors.especialidades.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-label-sm text-muted-foreground">Horario</label>
                <input
                  {...register("horario")}
                  placeholder="Ej. Lunes a Viernes, 10:00 - 18:00"
                  className={`border ${errors.horario ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors`}
                />
                {errors.horario && <span className="text-caption-sm text-red-500">{errors.horario.message}</span>}
              </div>
            </div>
          </section>

          {/* Section 03 */}
          <section className="bg-muted p-8 md:p-12 space-y-8">
            <div className="flex justify-between items-center pb-6">
              <div>
                <h2 className="text-h2 mb-2">03. Publicar</h2>
                <p className="text-body-sm text-muted-foreground max-w-sm">Tu anuncio queda publicado de forma permanente. Podés editar la información durante los primeros 30 días. Incluye mención en newsletter.</p>
              </div>
              <div className="text-right">
                <h3 className="text-display-lg">$ 20.000</h3>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-black text-white py-5 flex items-center justify-center transition-all duration-200 ease-editorial ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/90'}`}
            >
              <span className="text-button">{isSubmitting ? "Enviando..." : "PUBLICAR AVISO"}</span>
            </button>
          </section>

        </form>
      </main>

      {/*  <Footer /> */}
    </div>
  );
}
