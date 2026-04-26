"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpecialtyPill } from "@/components/ui/SpecialtyPill";
import Link from "next/link";
import { 
  LayoutGrid, 
  Briefcase, 
  Users, 
  BarChart, 
  Settings, 
  HelpCircle, 
  LogOut,
  Upload,
  X,
  CheckCircle2,
  Check
} from "lucide-react";

const profileSchema = z.object({
  nombre: z.string().min(1, "El nombre del estudio es requerido"),
  anio: z.string()
    .regex(/^\d{4}$/, "Ingresá un año válido. Ej: 2015")
    .refine((val) => {
      const year = parseInt(val);
      return year >= 1900 && year <= new Date().getFullYear();
    }, "El año no puede ser futuro ni anterior a 1900"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  bio: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  instagram: z.string()
    .regex(/^@[a-zA-Z0-9._]{2,30}$/, "Ingresá un usuario válido. Ej: @tuestudio")
    .min(1, "Este campo es requerido"),
  whatsapp: z.string()
    .regex(/^549\d{8,10}$/, "Ingresá un número válido. Ej: 5491112345678")
    .min(1, "Este campo es requerido"),
  website: z.string()
    .refine((val) => val === "" || /^https?:\/\/.+\..+/.test(val), {
      message: "Ingresá una URL válida. Ej: https://tuestudio.com"
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PerfilEstudioPage() {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [photos, setPhotos] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
      anio: "",
      ubicacion: "",
      bio: "",
      instagram: "",
      whatsapp: "",
      website: "",
    }
  });

  // Watch fields for live preview and validation
  const liveNombre = watch("nombre") || "Nombre de tu Estudio";
  const liveUbicacion = watch("ubicacion") || "Ubicación, Ciudad";
  const liveInstagram = watch("instagram");
  const liveWhatsapp = watch("whatsapp");
  const liveWebsite = watch("website");

  // --- Handlers ---
  const handleAddSpecialty = () => {
    const trimmed = specialtyInput.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties([...specialties, trimmed]);
      setSpecialtyInput("");
    }
  };

  const handleRemoveSpecialty = (spec: string) => {
    setSpecialties(specialties.filter((s) => s !== spec));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Check limit
    if (photos.length + files.length > 6) {
      alert("Solo puedes subir un máximo de 6 fotos.");
      return;
    }

    const newPhotos = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (idToRemove: string) => {
    setPhotos((prev) => {
      const photoToRemove = prev.find((p) => p.id === idToRemove);
      if (photoToRemove) URL.revokeObjectURL(photoToRemove.preview);
      return prev.filter((p) => p.id !== idToRemove);
    });
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Saving profile...", { ...data, specialties, photos });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000); // hide success message after 5s
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F4F4]">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row border-t border-border">
        
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 bg-white border-r border-border flex flex-col justify-between py-12 flex-shrink-0">
          <div>
            <div className="px-8 mb-12">
              <h2 className="font-serif text-xl tracking-tight uppercase font-bold">{liveNombre !== "Nombre de tu Estudio" ? liveNombre : "Tu Estudio"}</h2>
              <p className="font-sans text-[10px] tracking-widest text-muted-foreground uppercase mt-1">Configuración</p>
            </div>
            
            <nav className="flex flex-col space-y-2">
              <Link href="/dashboard" className="flex items-center space-x-4 px-8 py-4 text-muted-foreground hover:text-black transition-colors">
                <LayoutGrid className="w-4 h-4" />
                <span className="font-sans text-[10px] tracking-widest uppercase">Active Listings</span>
              </Link>
              <Link href="#" className="flex items-center space-x-4 px-8 py-4 bg-black text-white">
                <Settings className="w-4 h-4" />
                <span className="font-sans text-[10px] tracking-widest uppercase">Perfil del Estudio</span>
              </Link>
              <Link href="#" className="flex items-center space-x-4 px-8 py-4 text-muted-foreground hover:text-black transition-colors">
                <Briefcase className="w-4 h-4" />
                <span className="font-sans text-[10px] tracking-widest uppercase">Dashboard</span>
              </Link>
              <Link href="#" className="flex items-center space-x-4 px-8 py-4 text-muted-foreground hover:text-black transition-colors">
                <Users className="w-4 h-4" />
                <span className="font-sans text-[10px] tracking-widest uppercase">Artist Applications</span>
              </Link>
              <Link href="#" className="flex items-center space-x-4 px-8 py-4 text-muted-foreground hover:text-black transition-colors">
                <BarChart className="w-4 h-4" />
                <span className="font-sans text-[10px] tracking-widest uppercase">Studio Analytics</span>
              </Link>
            </nav>
          </div>

          <div className="px-8 flex flex-col space-y-6 mt-16 lg:mt-0">
            <button className="w-full bg-black text-white py-4 flex items-center justify-center hover:bg-black/90 transition-colors">
              <span className="font-sans text-[10px] tracking-widest uppercase">New Portfolio Upload</span>
            </button>
            <Link href="#" className="flex items-center space-x-4 text-muted-foreground hover:text-black transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="font-sans text-[10px] tracking-widest uppercase">Support</span>
            </Link>
            <Link href="#" className="flex items-center space-x-4 text-muted-foreground hover:text-black transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="font-sans text-[10px] tracking-widest uppercase">Logout</span>
            </Link>
          </div>
        </aside>

        {/* Center Column: Form */}
        <section className="flex-1 p-8 md:p-16 lg:pr-12">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight uppercase mb-12">Perfil del Estudio</h1>
          
          {isSuccess && (
            <div className="bg-[#EAEAEA] border border-black p-6 mb-12 flex items-center space-x-4">
              <CheckCircle2 className="w-6 h-6 text-black" />
              <span className="font-sans text-xs tracking-widest uppercase">Perfil actualizado correctamente.</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 max-w-2xl">
            
            {/* Section 01 */}
            <div className="space-y-8">
              <h2 className="font-serif text-3xl tracking-tight border-b border-border pb-4">
                01. Información Básica
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Nombre del Estudio</label>
                  <input 
                    {...register("nombre")}
                    placeholder="Ej. Ink & Concrete"
                    className={`border ${errors.nombre ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white`}
                  />
                  {errors.nombre && <span className="font-sans text-[10px] text-red-500">{errors.nombre.message}</span>}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Año de Fundación</label>
                  <input 
                    {...register("anio")}
                    placeholder="Ej. 2015"
                    className={`border ${errors.anio ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white`}
                  />
                  {errors.anio && <span className="font-sans text-[10px] text-red-500">{errors.anio.message}</span>}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Ubicación</label>
                  <input 
                    {...register("ubicacion")}
                    placeholder="Ej. Palermo, Buenos Aires"
                    className={`border ${errors.ubicacion ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white`}
                  />
                  {errors.ubicacion && <span className="font-sans text-[10px] text-red-500">{errors.ubicacion.message}</span>}
                </div>

                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Bio / Descripción</label>
                  <textarea 
                    {...register("bio")}
                    rows={4}
                    placeholder="Contá la historia de tu estudio..."
                    className={`border ${errors.bio ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white resize-none`}
                  />
                  {errors.bio && <span className="font-sans text-[10px] text-red-500">{errors.bio.message}</span>}
                </div>
              </div>
            </div>

            {/* Section 02 */}
            <div className="space-y-8">
              <h2 className="font-serif text-3xl tracking-tight border-b border-border pb-4">
                02. Especialidades
              </h2>
              
              <div className="flex flex-col space-y-6">
                <div className="flex gap-4">
                  <input 
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSpecialty(); } }}
                    placeholder="Añadir especialidad..."
                    className="flex-1 border border-border px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddSpecialty}
                    className="bg-black text-white px-8 py-3 font-sans text-[10px] tracking-widest uppercase hover:bg-black/90 transition-colors"
                  >
                    Agregar +
                  </button>
                </div>

                {specialties.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {specialties.map((spec) => (
                      <div key={spec} className="flex items-center bg-black text-white border border-black group cursor-pointer" onClick={() => handleRemoveSpecialty(spec)}>
                        <SpecialtyPill label={spec} variant="default" />
                        <span className="pr-3 text-white/50 group-hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section 03 */}
            <div className="space-y-8">
              <h2 className="font-serif text-3xl tracking-tight border-b border-border pb-4">
                03. Redes y Contacto
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Instagram</label>
                  <div className="relative">
                    <input 
                      {...register("instagram")}
                      placeholder="@tuestudio"
                      className={`w-full border ${errors.instagram ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white pr-10`}
                    />
                    {liveInstagram && liveInstagram.length > 0 && !errors.instagram && (
                      <Check className="w-4 h-4 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {errors.instagram && <span className="font-sans text-[10px] text-red-500">{errors.instagram.message}</span>}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Número de WhatsApp</label>
                  <div className="relative">
                    <input 
                      {...register("whatsapp")}
                      placeholder="5491112345678"
                      className={`w-full border ${errors.whatsapp ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white pr-10`}
                    />
                    {liveWhatsapp && liveWhatsapp.length > 0 && !errors.whatsapp && (
                      <Check className="w-4 h-4 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {errors.whatsapp && <span className="font-sans text-[10px] text-red-500">{errors.whatsapp.message}</span>}
                </div>

                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Website (Opcional)</label>
                  <div className="relative">
                    <input 
                      {...register("website")}
                      placeholder="https://"
                      className={`w-full border ${errors.website ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none font-sans text-sm focus:border-black transition-colors bg-white pr-10`}
                    />
                    {liveWebsite && liveWebsite.length > 0 && !errors.website && (
                      <Check className="w-4 h-4 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {errors.website && <span className="font-sans text-[10px] text-red-500">{errors.website.message}</span>}
                </div>
              </div>
            </div>

            {/* Section 04 */}
            <div className="space-y-8">
              <h2 className="font-serif text-3xl tracking-tight border-b border-border pb-4 flex justify-between items-end">
                <span>04. Fotos del Estudio</span>
                <span className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground font-normal pb-1">{photos.length}/6 Fotos</span>
              </h2>
              
              <div className="flex flex-col space-y-6">
                <div className="relative w-full border border-dashed border-border bg-white hover:bg-gray-50 transition-colors cursor-pointer group">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={photos.length >= 6}
                  />
                  <div className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground group-hover:text-black transition-colors">
                    <Upload className="w-6 h-6 mb-4" />
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase">Subir Fotos</span>
                    <span className="font-sans text-[10px] mt-2 opacity-50">Arrastra archivos o haz clic aquí (Max 6)</span>
                  </div>
                </div>

                {photos.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative w-32 h-32 flex-shrink-0 border border-border group bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-2 right-2 bg-black text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-border/50">
              <button 
                type="submit" 
                className="w-full bg-black text-white py-5 flex items-center justify-center hover:bg-black/90 transition-colors"
              >
                <span className="font-sans text-xs tracking-widest uppercase">Guardar Cambios</span>
              </button>
            </div>
            
          </form>
        </section>

        {/* Right Panel: Preview */}
        <aside className="w-full lg:w-80 p-8 md:p-16 lg:pl-0 flex flex-col space-y-8 flex-shrink-0">
          
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground border-b border-border pb-4 block">Vista Previa</span>
          
          <div className="bg-white border border-border p-8 text-center flex flex-col items-center">
            <h3 className="font-serif text-3xl tracking-tight uppercase mb-2">{liveNombre}</h3>
            <p className="font-sans text-xs text-muted-foreground mb-6">{liveUbicacion}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-[200px]">
              {specialties.length > 0 ? specialties.slice(0, 3).map((spec) => (
                <SpecialtyPill key={spec} label={spec} variant="outline" />
              )) : (
                <span className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground/50 border border-border/50 px-2 py-1">Sin especialidades</span>
              )}
            </div>

            <div className="w-full h-32 bg-gray-100 flex items-center justify-center border border-border">
              <span className="font-sans text-[8px] tracking-widest uppercase text-muted-foreground">Foto de Portada</span>
            </div>
          </div>

          <Link href="/estudios/mi-estudio" className="w-full bg-transparent border border-black text-black py-4 flex items-center justify-center hover:bg-black/5 transition-colors">
            <span className="font-sans text-[10px] tracking-widest uppercase">Ver Perfil Público &rarr;</span>
          </Link>

        </aside>
      </main>

      <Footer />
    </div>
  );
}
