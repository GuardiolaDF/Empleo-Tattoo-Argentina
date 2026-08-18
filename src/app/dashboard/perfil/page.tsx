"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpecialtyPill } from "@/components/ui/SpecialtyPill";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { 
  Upload,
  X,
  CheckCircle2,
  Check,
  Pencil
} from "lucide-react";

const profileSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre del estudio es requerido")
    .max(30, "Máximo 30 caracteres"),
  anio: z.string()
    .regex(/^\d{4}$/, "Ingresá un año válido. Ej: 2015")
    .refine((val) => {
      const year = parseInt(val);
      return year >= 1900 && year <= new Date().getFullYear();
    }, "El año no puede ser futuro ni anterior a 1900"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  bio: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  instagram: z.string()
    .regex(/^[a-zA-Z0-9._]{2,30}$/, "Solo letras, números, puntos y guiones bajos. Mín. 2 caracteres.")
    .min(1, "Este campo es requerido"),
  whatsapp: z.string()
    .regex(/^\d{2}\s\d{4}\s\d{4}$/, "Ingresá un número válido. Ej: 11 2222 3333")
    .min(1, "Este campo es requerido"),
  website: z.string()
    .refine((val) => val === "" || /^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}/.test(val), {
      message: "Ingresá un dominio válido. Ej: tuestudio.com"
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const COUNTRY_CODES = [
  { code: "54", flag: "🇦🇷", label: "+54 Argentina" },
  { code: "598", flag: "🇺🇾", label: "+598 Uruguay" },
  { code: "56", flag: "🇨🇱", label: "+56 Chile" },
  { code: "591", flag: "🇧🇴", label: "+591 Bolivia" },
  { code: "595", flag: "🇵🇾", label: "+595 Paraguay" },
  { code: "55", flag: "🇧🇷", label: "+55 Brasil" },
  { code: "34", flag: "🇪🇸", label: "+34 España" },
];

export default function PerfilEstudioPage() {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [photos, setPhotos] = useState<{ id: string; file?: File; preview: string; url?: string }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [portadaUrl, setPortadaUrl] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [studioId, setStudioId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
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
  const liveNombreRaw = watch("nombre") || "";
  const liveNombre = liveNombreRaw || "Nombre de tu Estudio";
  const liveUbicacion = watch("ubicacion") || "Ubicación, Ciudad";
  const liveInstagram = watch("instagram");
  const liveWhatsapp = watch("whatsapp");
  const liveWebsite = watch("website");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load existing studio data if user is logged in
  useEffect(() => {
    if (status !== 'authenticated') return;
    async function loadStudio() {
      try {
        const res = await fetch('/api/studio');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            reset({
              nombre: data.nombre || '',
              anio: data.anio || '',
              ubicacion: data.ubicacion || '',
              bio: data.bio || '',
              instagram: data.instagram?.replace('@', '') || '',
              whatsapp: data.whatsapp || '',
              website: data.website || '',
            });
            setSpecialties(data.especialidades || []);
            if (data.fotos?.length > 0) {
              setPhotos(data.fotos.map((url: string, i: number) => ({
                id: `cloud-${i}`,
                preview: url,
                url: url,
              })));
            }
            const country = COUNTRY_CODES.find(c => c.code === data.countryCode);
            if (country) setSelectedCountry(country);
            if (data._id) setStudioId(data._id);
            if (data.portada) setPortadaUrl(data.portada);
          }
        }
      } catch (error) {
        console.error('Error loading studio:', error);
      }
    }
    loadStudio();
  }, [status, reset]);

  const { onChange: onChangeWhatsapp, ...restWhatsapp } = register("whatsapp");

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    if (photos.length + files.length > 6) {
      alert("Solo puedes subir un máximo de 6 fotos.");
      return;
    }

    // Upload each file to Cloudinary
    for (const file of files) {
      const tempId = Math.random().toString(36).substring(7);
      const preview = URL.createObjectURL(file);
      
      // Add with local preview immediately
      setPhotos(prev => [...prev, { id: tempId, file, preview }]);

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          // Replace preview with Cloudinary URL
          setPhotos(prev => prev.map(p => 
            p.id === tempId ? { ...p, url: data.url, preview: data.url } : p
          ));
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleRemovePhoto = (idToRemove: string) => {
    setPhotos((prev) => {
      const photoToRemove = prev.find((p) => p.id === idToRemove);
      if (photoToRemove) URL.revokeObjectURL(photoToRemove.preview);
      return prev.filter((p) => p.id !== idToRemove);
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        // Save portada to studio
        await fetch("/api/studio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ portada: url }),
        });
        // Update local state
        setPortadaUrl(url);
      }
    } catch (error) {
      console.error("Cover upload error:", error);
    } finally {
      setUploadingCover(false);
    }
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: ProfileFormValues) => {
    // If not logged in, redirect to auth with callback
    if (!session?.user) {
      router.push('/auth/login?callbackUrl=/dashboard/perfil');
      return;
    }

    setIsSaving(true);
    try {
      const rawDigits = data.whatsapp.replace(/\D/g, '');
      const prefix = selectedCountry.code === "54" ? "549" : selectedCountry.code;
      const finalWhatsapp = `${prefix}${rawDigits}`;
      const finalInstagram = `@${data.instagram}`;
      
      const photoUrls = photos
        .map(p => p.url || p.preview)
        .filter(url => url.startsWith('http'));

      const payload = {
        nombre: data.nombre,
        anio: data.anio,
        ubicacion: data.ubicacion,
        bio: data.bio,
        instagram: finalInstagram,
        whatsapp: finalWhatsapp,
        countryCode: selectedCountry.code,
        website: data.website || '',
        especialidades: specialties,
        fotos: photoUrls,
      };

      const res = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert('Error al guardar. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error de conexión.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row border-t border-border">
        
        <DashboardSidebar studioName={liveNombre !== "Nombre de tu Estudio" ? liveNombre : undefined} />

        {/* Center Column: Form */}
        <section className="flex-1 p-8 md:p-16 lg:pr-12">
          <h1 className="text-display-xl mb-12">Perfil del Estudio</h1>
          
          {isSuccess && (
            <div className="bg-gray-100 border border-black p-6 mb-12 flex items-center space-x-4">
              <CheckCircle2 className="w-6 h-6 text-black" />
              <span className="text-button">Perfil actualizado correctamente.</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 max-w-2xl">
            
            {/* Section 01 */}
            <div className="space-y-8">
              <h2 className="text-h2 border-b border-border pb-4">
                01. Información Básica
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="text-label-sm text-muted-foreground">Nombre del Estudio</label>
                  <input 
                    {...register("nombre")}
                    placeholder="Ej. Ink & Concrete"
                    className={`border ${errors.nombre ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white`}
                  />
                  <div className="flex justify-between items-start mt-1">
                    <span className="text-caption-sm text-red-500">{errors.nombre ? errors.nombre.message : ""}</span>
                    <span className="text-caption-sm text-muted-foreground ml-auto">
                      {liveNombreRaw.length}/30
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-label-sm text-muted-foreground">Año de Fundación</label>
                  <input 
                    {...register("anio")}
                    placeholder="Ej. 2015"
                    className={`border ${errors.anio ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white`}
                  />
                  {errors.anio && <span className="text-caption-sm text-red-500">{errors.anio.message}</span>}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-label-sm text-muted-foreground">Ubicación</label>
                  <input 
                    {...register("ubicacion")}
                    placeholder="Ej. Palermo, Buenos Aires"
                    className={`border ${errors.ubicacion ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white`}
                  />
                  {errors.ubicacion && <span className="text-caption-sm text-red-500">{errors.ubicacion.message}</span>}
                </div>

                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="text-label-sm text-muted-foreground">Bio / Descripción</label>
                  <textarea 
                    {...register("bio")}
                    rows={4}
                    placeholder="Contá la historia de tu estudio..."
                    className={`border ${errors.bio ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white resize-none`}
                  />
                  {errors.bio && <span className="text-caption-sm text-red-500">{errors.bio.message}</span>}
                </div>
              </div>
            </div>

            {/* Section 02 */}
            <div className="space-y-8">
              <h2 className="text-h2 border-b border-border pb-4">
                02. Especialidades
              </h2>
              
              <div className="flex flex-col space-y-6">
                <div className="flex gap-4">
                  <select 
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    className="flex-1 border border-border px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white appearance-none"
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
                  <button 
                    type="button" 
                    onClick={handleAddSpecialty}
                    className="bg-black text-white px-8 py-3 text-button hover:bg-black/90 transition-colors"
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
              <h2 className="text-h2 border-b border-border pb-4">
                03. Redes y Contacto
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-label-sm text-muted-foreground">Instagram</label>
                  <div className="relative flex">
                    <div className="flex items-center px-4 bg-muted border border-r-0 border-border cursor-default text-body text-muted-foreground">
                      @
                    </div>
                    <div className="relative flex-1">
                      <input 
                        {...register("instagram")}
                        placeholder="tuestudio"
                        className={`w-full border ${errors.instagram ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white pr-10`}
                      />
                      {liveInstagram && liveInstagram.length > 0 && !errors.instagram && (
                        <Check className="w-4 h-4 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>
                  {errors.instagram && <span className="text-caption-sm text-red-500">{errors.instagram.message}</span>}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-label-sm text-muted-foreground">Número de WhatsApp</label>
                  <div className="relative flex">
                    <div className="relative flex items-stretch bg-muted border border-r-0 border-border text-body text-muted-foreground" ref={dropdownRef}>
                      <button 
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className="px-4 py-3 flex items-center gap-2 hover:bg-black/5 transition-colors"
                      >
                        {selectedCountry.flag} +{selectedCountry.code}
                      </button>
                      {isCountryDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-border z-50 shadow-dropdown">
                          {COUNTRY_CODES.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country);
                                setIsCountryDropdownOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-black/5 transition-colors text-body-sm flex items-center gap-3 text-black border-b border-border/50 last:border-0"
                            >
                              <span className="text-sm">{country.flag}</span> <span>{country.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative flex-1">
                      <input 
                        {...restWhatsapp}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 10) val = val.slice(0, 10);
                          let formatted = val;
                          if (val.length > 2) formatted = val.slice(0, 2) + ' ' + val.slice(2);
                          if (val.length > 6) formatted = val.slice(0, 2) + ' ' + val.slice(2, 6) + ' ' + val.slice(6);
                          e.target.value = formatted;
                          onChangeWhatsapp(e);
                        }}
                        placeholder="11 2222 3333"
                        className={`w-full border ${errors.whatsapp ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white pr-10`}
                      />
                      {liveWhatsapp && liveWhatsapp.length > 0 && !errors.whatsapp && (
                        <Check className="w-4 h-4 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>
                  {errors.whatsapp && <span className="text-caption-sm text-red-500">{errors.whatsapp.message}</span>}
                </div>

                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="text-label-sm text-muted-foreground">Website (Opcional)</label>
                  <div className="relative flex">
                    <div className="flex items-center px-4 bg-muted border border-r-0 border-border cursor-default text-body text-muted-foreground">
                      https://
                    </div>
                    <div className="relative flex-1">
                      <input 
                        {...register("website")}
                        placeholder="tuestudio.com (opcional)"
                        className={`w-full border ${errors.website ? 'border-red-500' : 'border-border'} px-4 py-3 outline-none text-body focus:border-black transition-colors bg-white pr-10`}
                      />
                      {liveWebsite && liveWebsite.length > 0 && !errors.website && (
                        <Check className="w-4 h-4 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>
                  {errors.website && <span className="text-caption-sm text-red-500">{errors.website.message}</span>}
                </div>
              </div>
            </div>

            {/* Section 04 */}
            <div className="space-y-8">
              <h2 className="text-h2 border-b border-border pb-4 flex justify-between items-end">
                <span>04. Fotos del Estudio y Portada</span>
                <span className="text-label-sm text-muted-foreground font-normal pb-1">{photos.length}/6 Fotos</span>
              </h2>
              
              {/* Foto de Portada (Optimizado para Móvil y Desktop) */}
              <div className="flex flex-col space-y-3">
                <label className="text-label-sm text-muted-foreground font-medium">Foto de Portada del Estudio</label>
                <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center border border-border overflow-hidden group">
                  {portadaUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={portadaUrl} alt="Portada" className="absolute inset-0 w-full h-full object-cover z-0" />
                  ) : (
                    <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground z-0">Sin Foto de Portada</span>
                  )}
                  <label
                    htmlFor="cover-photo-input"
                    className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center cursor-pointer opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    {uploadingCover ? (
                      <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Pencil className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">{portadaUrl ? "Cambiar Portada" : "Subir Foto de Portada"}</span>
                      </div>
                    )}
                  </label>
                  <input
                    id="cover-photo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </div>
              </div>

              {/* Galería de Fotos */}
              <div className="flex flex-col space-y-4">
                <label className="text-label-sm text-muted-foreground font-medium">Galería de Fotos del Local (Máx. 6)</label>
                <label htmlFor="gallery-photo-input" className="relative w-full border border-dashed border-border bg-white hover:bg-gray-50 transition-colors cursor-pointer group block">
                  <input 
                    id="gallery-photo-input"
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={photos.length >= 6}
                  />
                  <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center text-muted-foreground group-hover:text-black transition-colors">
                    <Upload className="w-6 h-6 mb-3" />
                    <span className="text-label-sm font-bold">Subir Fotos</span>
                    <span className="text-caption-sm mt-1 opacity-70">Tocá aquí para seleccionar de tu galería o cámara (Máx 6)</span>
                  </div>
                </label>

                {photos.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 border border-border group bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-2 right-2 bg-black text-white p-1.5 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
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
                disabled={isSaving}
                className={`w-full bg-black text-white py-5 flex items-center justify-center transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/90'}`}
              >
                <span className="text-button">{isSaving ? 'Guardando...' : session?.user ? 'Guardar Cambios' : 'Guardar e Identificarse'}</span>
              </button>
            </div>
            
          </form>
        </section>

        {/* Right Panel: Preview */}
        <aside className="w-full lg:w-80 p-8 md:p-16 lg:pl-0 flex flex-col space-y-8 flex-shrink-0">
          
          <span className="text-label-sm text-muted-foreground border-b border-border pb-4 block">Vista Previa</span>
          
          <div className="bg-white border border-border p-8 text-center flex flex-col items-center overflow-hidden w-full">
            <h3 className="text-h2 uppercase mb-2 max-w-full break-words line-clamp-3">{liveNombre}</h3>
            <p className="text-body-sm text-muted-foreground mb-6 max-w-full break-words line-clamp-3">{liveUbicacion}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-[200px]">
              {specialties.length > 0 ? specialties.slice(0, 3).map((spec) => (
                <SpecialtyPill key={spec} label={spec} variant="outline" />
              )) : (
                <span className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground/50 border border-border/50 px-2 py-1">Sin especialidades</span>
              )}
            </div>

            <div className="relative w-full h-32 bg-gray-100 flex items-center justify-center border border-border group overflow-hidden">
              {portadaUrl ? (
                <img src={portadaUrl} alt="Portada" className="absolute inset-0 w-full h-full object-cover z-0" />
              ) : (
                <span className="font-sans text-[8px] tracking-widest uppercase text-muted-foreground z-0">Foto de Portada</span>
              )}
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                {uploadingCover ? (
                  <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Pencil className="w-5 h-5" />
                    <span className="text-[10px] tracking-widest uppercase">Subir Portada</span>
                  </div>
                )}
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </div>
          </div>

          {studioId ? (
            <Link href={`/estudios/${studioId}`} className="w-full bg-transparent border border-black text-black py-4 flex items-center justify-center hover:bg-black/5 transition-colors">
              <span className="text-button">Ver Perfil Público &rarr;</span>
            </Link>
          ) : (
            <button disabled className="w-full bg-transparent border border-gray-300 text-gray-400 py-4 flex items-center justify-center cursor-not-allowed">
              <span className="text-button">Guardá para ver Perfil Público</span>
            </button>
          )}

        </aside>
      </main>

      <Footer />
    </div>
  );
}
