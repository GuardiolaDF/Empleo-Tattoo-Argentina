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
    <Link href={`/convenciones/${convention.slug}`} className="group relative block bg-white border border-border overflow-hidden hover:border-black transition-colors">
      
      {/* Poster Container */}
      <div className="relative w-full h-[400px] bg-gray-50 border-b border-border flex items-center justify-center p-0">
        {convention.posterUrl ? (
          <img 
            src={convention.posterUrl} 
            alt={`Poster de ${convention.title}`}
            className={`w-full h-full object-contain ${isCancelled ? 'grayscale opacity-50' : ''}`}
          />
        ) : (
          <div className="text-muted-foreground text-sm">Sin imagen</div>
        )}

        {/* Status Badges */}
        {isPostponed && (
          <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">
            Pospuesto
          </div>
        )}
        {isCancelled && (
          <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">
            Cancelado
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        <h3 className="text-xl font-bold text-black group-hover:underline transition-all line-clamp-2">
          {convention.title}
        </h3>
        
        <div className="flex flex-col gap-3 text-body-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 shrink-0 text-black" />
            <span className="uppercase font-medium tracking-wider">
              {formatDates(convention.startDate, convention.endDate)}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 shrink-0 text-black" />
            <span className="line-clamp-1">
              {convention.city} — {convention.province}
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
          {convention.instagramUrl && (
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-black hover:bg-black hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
          )}
          {convention.websiteUrl && (
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-black hover:bg-black hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
