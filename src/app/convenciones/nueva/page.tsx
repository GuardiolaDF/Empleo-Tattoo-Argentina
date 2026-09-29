'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createConventionSchema } from '@/lib/schemas';
import { z } from 'zod';

type FormData = z.infer<typeof createConventionSchema>;

export default function NuevaConvencionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [posterPublicId, setPosterPublicId] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    // @ts-ignore - TS has issues matching z.coerce.date() with react-hook-form
    resolver: zodResolver(createConventionSchema),
    defaultValues: {
      province: '',
      city: '',
    }
  });

  const onSubmit = async (data: FormData) => {
    if (!posterUrl) {
      setError('Debes subir un póster para la convención');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...data,
        posterUrl,
        posterPublicId
      };

      const res = await fetch('/api/conventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Ocurrió un error al enviar la convención');
      }

      // Success
      router.push('/dashboard?tab=convenciones&success=true');
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/convenciones" className="inline-flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver</span>
      </Link>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Publicar Convención</h1>
        <p className="text-neutral-400 mb-8">Completa los datos para proponer una nueva convención en la cartelera. Será revisada por nuestro equipo antes de publicarse.</p>

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Nombre de la convención *</label>
            <input 
              {...register('title')} 
              type="text" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="Ej. Buenos Aires Tattoo Show 2026"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Póster */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Póster oficial *</label>
            <CldUploadWidget 
              uploadPreset="ml_default" // Should probably configure a specific preset in Cloudinary, but default often works if unsigned is allowed. We will leave it generic.
              options={{ maxFiles: 1, clientAllowedFormats: ['jpg', 'png', 'webp'], maxFileSize: 5000000 }}
              onSuccess={(result: any) => {
                setPosterUrl(result.info.secure_url);
                setPosterPublicId(result.info.public_id);
                setValue('posterUrl', result.info.secure_url);
              }}
            >
              {({ open }) => (
                <div 
                  onClick={() => open()}
                  className="w-full aspect-[4/5] max-w-sm mx-auto sm:mx-0 border-2 border-dashed border-neutral-700 hover:border-primary/50 bg-neutral-950 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden group"
                >
                  {posterUrl ? (
                    <img src={posterUrl} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center p-6 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <ImagePlus className="w-6 h-6 text-neutral-400 group-hover:text-primary" />
                      </div>
                      <p className="text-white font-medium mb-1">Subir póster</p>
                      <p className="text-xs text-neutral-500">JPG, PNG o WEBP (Max 5MB)</p>
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>
            <input type="hidden" {...register('posterUrl')} />
            {(!posterUrl && errors.posterUrl) && <p className="text-red-400 text-sm mt-1">{errors.posterUrl.message}</p>}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Fecha de inicio *</label>
              <input 
                {...register('startDate')} 
                type="date" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors [color-scheme:dark]"
              />
              {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Fecha de finalización *</label>
              <input 
                {...register('endDate')} 
                type="date" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors [color-scheme:dark]"
              />
              {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate.message}</p>}
            </div>
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Provincia *</label>
              <select 
                {...register('province')}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                <option value="">Seleccionar...</option>
                <option value="Buenos Aires">Buenos Aires</option>
                <option value="CABA">CABA</option>
                <option value="Córdoba">Córdoba</option>
                <option value="Santa Fe">Santa Fe</option>
                <option value="Mendoza">Mendoza</option>
                {/* Expand options as needed */}
              </select>
              {errors.province && <p className="text-red-400 text-sm mt-1">{errors.province.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Ciudad *</label>
              <input 
                {...register('city')} 
                type="text" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="Ej. La Plata"
              />
              {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Nombre del lugar (Opcional)</label>
              <input 
                {...register('venue')} 
                type="text" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="Ej. Centro de Exposiciones"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Dirección (Opcional)</label>
              <input 
                {...register('address')} 
                type="text" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="Ej. Av. Principal 123"
              />
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Instagram (Opcional)</label>
              <input 
                {...register('instagramUrl')} 
                type="text" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="Ej. instagram.com/convencion"
              />
              {errors.instagramUrl && <p className="text-red-400 text-sm mt-1">{errors.instagramUrl.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Sitio Web (Opcional)</label>
              <input 
                {...register('websiteUrl')} 
                type="text" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="Ej. www.convencion.com"
              />
              {errors.websiteUrl && <p className="text-red-400 text-sm mt-1">{errors.websiteUrl.message}</p>}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-neutral-800">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar para revisión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
