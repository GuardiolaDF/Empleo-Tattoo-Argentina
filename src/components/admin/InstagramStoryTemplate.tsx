"use client";

import React, { forwardRef } from 'react';

interface InstagramStoryTemplateProps {
  studioName: string;
  category: string;
  location: string;
}

function formatLocation(loc: string) {
  if (!loc) return "";
  const parts = loc.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    const prov = parts[0].toUpperCase();
    if (prov.includes('CABA') || prov.includes('CAPITAL FEDERAL')) {
      return parts[1]; // Barrio
    } else if (prov.includes('BUENOS AIRES') || prov.includes('GBA')) {
      return parts[1]; // Ciudad
    } else {
      return `${parts[1]}, ${parts[0]}`; // Ciudad, Provincia
    }
  }
  return loc;
}

export const InstagramStoryTemplate = forwardRef<HTMLDivElement, InstagramStoryTemplateProps>(
  ({ studioName, category, location }, ref) => {
    return (
      <div 
        ref={ref}
        className="relative bg-[#C0C0C0] text-black overflow-hidden font-sans"
        style={{ 
          width: '1080px', 
          height: '1920px', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        {/* Superior */}
        <div className="flex justify-between items-end px-16 pt-32 pb-16 h-[380px]">
          <div className="flex items-end w-full">
            <h1 className="text-[110px] leading-[0.9] font-serif flex-shrink-0" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
              Nueva<br/>publicación
            </h1>
            <div className="flex-1 h-2 bg-black mx-12 mb-4"></div>
            {/* Asterisco SVG */}
            <svg className="w-40 h-40 flex-shrink-0 mb-4" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0 L55 35 L90 20 L70 50 L100 65 L65 70 L70 100 L50 75 L30 100 L35 70 L0 65 L30 50 L10 20 L45 35 Z" />
            </svg>
          </div>
        </div>

        {/* Medio (Blanco) */}
        <div className="bg-[#EAEAEA] flex-1 px-16 py-24 flex flex-col justify-center">
          <h2 className="text-[130px] font-black uppercase tracking-tight leading-none mb-12">
            {studioName}
          </h2>
          <span className="text-[100px] font-serif mb-12" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
            busca
          </span>
          {/* Ajuste de tamaño para asegurar que entre en una línea */}
          <h3 className="text-[140px] font-black uppercase tracking-tighter leading-[0.8] mb-16 whitespace-nowrap overflow-hidden">
            {category}
          </h3>
          <div className="flex items-end w-full mt-auto mb-8">
            <span className="text-[100px] font-serif mb-2 flex-shrink-0" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
              en
            </span>
            {/* Línea expansible */}
            <div className="flex-1 h-2 bg-black mx-8 mb-6"></div>
            {/* Pin y Ubicación */}
            <div className="flex items-center space-x-6 mb-2 flex-shrink-0">
              <svg className="w-24 h-24 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="text-[100px] font-black uppercase tracking-tight leading-none whitespace-nowrap">
                {formatLocation(location)}
              </span>
            </div>
          </div>
        </div>

        {/* Inferior */}
        <div className="h-[500px] px-16 pt-24 relative bg-[#C0C0C0]">
          <h4 className="text-[90px] font-serif pl-8" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
            mirá el anuncio completo
          </h4>
          
          {/* Flecha curvada */}
          <svg className="absolute left-16 top-56 w-[200px] h-[200px]" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="3">
            <path d="M 40 10 C -10 10, -10 90, 40 90" strokeLinecap="round" fill="none" />
            <polygon points="35,80 45,90 35,100" fill="black" stroke="black" strokeWidth="1" />
          </svg>
        </div>
      </div>
    );
  }
);

InstagramStoryTemplate.displayName = 'InstagramStoryTemplate';
