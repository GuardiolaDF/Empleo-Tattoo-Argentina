'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { updateConventionSchema } from '@/lib/schemas';
import { z } from 'zod';

type FormData = z.infer<typeof updateConventionSchema> & { eventStatus?: string };

export default function ConventionEditForm({ convention }: { convention: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string>(convention.posterUrl || '');
  const [posterPublicId, setPosterPublicId] = useState<string>(convention.posterPublicId || '');

  // Format dates for input[type="date"]
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
  };

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    // @ts-ignore - TS has issues matching z.coerce.date() with react-hook-form
    resolver: zodResolver(updateConventionSchema),
    defaultValues: {
      title: convention.title,
      province: convention.province,
      city: convention.city,
      venue: convention.venue || '',
      address: convention.address || '',
      instagramUrl: convention.instagramUrl || '',
      websiteUrl: convention.websiteUrl || '',
      startDate: formatDateForInput(convention.startDate) as any,
      endDate: formatDateForInput(convention.endDate) as any,
      eventStatus: convention.eventStatus || 'scheduled'
    }
  });

  const onSubmit = async (data: FormData) => {
    if (!posterUrl) {
      setError('Debes tener un póster para la convención');
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

      const res = await fetch(`/api/conventions/${convention._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Ocurrió un error al actualizar la convención');
      }

      router.push('/dashboard?tab=convenciones&success=true');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-10">
      <h1 className="text-3xl font-extrabold text-white mb-2">Editar Convención</h1>
      <p className="text-neutral-400 mb-8">Actualiza los datos de tu evento. El cambio de información no altera el estado de publicación.</p>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Status */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Estado del Evento</label>
          <select 
            {...register('eventStatus')}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          >
            <option value="scheduled">Programado</option>
            <option value="postponed">Pospuesto</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Nombre de la convención *</label>
          <input 
            {...register('title')} 
            type="text" 
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Póster */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Póster oficial *</label>
          <CldUploadWidget 
            uploadPreset="ml_default"
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
                    <p className="text-white font-medium mb-1">Cambiar póster</p>
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>
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
            </select>
            {errors.province && <p className="text-red-400 text-sm mt-1">{errors.province.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Ciudad *</label>
            <input 
              {...register('city')} 
              type="text" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
            {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Nombre del lugar</label>
            <input 
              {...register('venue')} 
              type="text" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Dirección</label>
            <input 
              {...register('address')} 
              type="text" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Instagram</label>
            <input 
              {...register('instagramUrl')} 
              type="text" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
            {errors.instagramUrl && <p className="text-red-400 text-sm mt-1">{errors.instagramUrl.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Sitio Web</label>
            <input 
              {...register('websiteUrl')} 
              type="text" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
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
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
