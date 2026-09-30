'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Globe } from 'lucide-react';
import { IConvention } from '@/models/Convention';

interface ConventionCardProps {
  convention: Partial<IConvention>;
}

export default function ConventionCard({ convention }: ConventionCardProps) {
  // Format dates: "12—14 OCT"
  const formatDates = (start?: Date, end?: Date) => {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = startDate.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase();
    
    if (startDay === endDay) {
      return `${startDay} ${month}`;
    }
    return `${startDay}—${endDay} ${month}`;
  };

  const isPostponed = convention.eventStatus === 'postponed';
  const isCancelled = convention.eventStatus === 'cancelled';

  return (
    <div className="relative flex flex-col lg:flex-row bg-white overflow-hidden min-h-[calc(100vh-73px)] lg:h-[calc(100vh-73px)] group">
      
      {/* Poster Container - Left side */}
      <div className="relative w-full lg:w-[55%] h-[60vh] lg:h-full bg-gray-100 flex items-center justify-center p-8 lg:p-12 lg:border-r-4 border-black overflow-hidden">
        {convention.posterUrl ? (
          <img 
            src={convention.posterUrl} 
            alt={`Poster de ${convention.title}`}
            className={`w-full h-full object-contain shadow-2xl ${isCancelled ? 'grayscale opacity-50' : ''}`}
          />
        ) : (
          <div className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Sin imagen disponible</div>
        )}

        {/* Status Badges */}
        {isPostponed && (
          <div className="absolute top-8 right-8 bg-black text-white text-sm font-bold px-4 py-2 uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
            Pospuesto
          </div>
        )}
        {isCancelled && (
          <div className="absolute top-8 right-8 bg-red-600 text-white text-sm font-bold px-4 py-2 uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
            Cancelado
          </div>
        )}
      </div>

      {/* Content - Right side */}
      <div className="w-full lg:w-[45%] h-full p-10 lg:p-20 flex flex-col bg-white overflow-y-auto">
        
        {/* Date top left of the content panel */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 border-4 border-black px-6 py-3 bg-black text-white">
            <span className="uppercase font-bold tracking-widest text-lg lg:text-2xl">
              {formatDates(convention.startDate, convention.endDate)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-10">
          <h3 className="text-4xl lg:text-6xl lg:leading-[1.1] font-black text-black uppercase break-words">
            {convention.title}
          </h3>
          
          <div className="flex items-start gap-4 text-xl lg:text-2xl text-black">
            <MapPin className="w-8 h-8 shrink-0 stroke-[3] mt-1" />
            <div className="flex flex-col">
              <span className="font-bold uppercase tracking-wider">
                {convention.city} — {convention.province}
              </span>
              {(convention.venue || convention.address) && (
                <span className="text-lg mt-2 font-medium text-neutral-600">
                  {convention.venue && <span className="block">{convention.venue}</span>}
                  {convention.address && <span className="block text-base mt-1">📍 {convention.address}</span>}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto pt-16 flex items-center justify-end gap-4 border-t-4 border-black">
          {convention.instagramUrl && (
            <a href={convention.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-14 h-14 bg-black text-white hover:bg-black/80 transition-colors" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          )}
          {convention.websiteUrl && (
            <a href={convention.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-14 h-14 bg-black text-white hover:bg-black/80 transition-colors" title="Sitio Web">
              <Globe className="w-6 h-6" />
            </a>
          )}
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (navigator.share) {
                navigator.share({
                  title: convention.title,
                  url: `${window.location.origin}/convenciones/${convention.slug}`
                });
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/convenciones/${convention.slug}`);
                alert("Enlace copiado al portapapeles");
              }
            }}
            className="flex items-center justify-center w-14 h-14 bg-black text-white hover:bg-black/80 transition-colors"
            title="Compartir"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
