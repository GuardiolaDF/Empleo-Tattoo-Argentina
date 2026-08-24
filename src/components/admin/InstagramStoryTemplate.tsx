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
    const upperLoc = loc.toUpperCase();
    
    // Asumimos formato: [Calle/Barrio], [Ciudad], [Provincia], [País]
    // Buscamos la provincia en las últimas posiciones
    let city = parts.length > 2 ? parts[parts.length - 2] : parts[0];
    let prov = parts[parts.length - 1];

    if (prov.toUpperCase().includes('ARGENTINA') && parts.length >= 3) {
      prov = parts[parts.length - 2];
      city = parts[parts.length - 3];
    }
    
    if (upperLoc.includes('CABA') || upperLoc.includes('CAPITAL FEDERAL')) {
      return city; // Barrio
    } else if (upperLoc.includes('BUENOS AIRES') || upperLoc.includes('GBA')) {
      return city; // Ciudad
    } else {
      return `${city}, ${prov}`; // Ciudad, Provincia
    }
  }
  return loc;
}

export const InstagramStoryTemplate = forwardRef<HTMLDivElement, InstagramStoryTemplateProps>(
  ({ studioName, category, location }, ref) => {
    
    // Dynamic text sizing based on length to fit screen without clipping
    const roleText = category.toUpperCase();
    const locText = formatLocation(location).toUpperCase();
    
    const roleFontSize = Math.min(180, Math.floor(1300 / Math.max(roleText.length, 1))); 
    const locFontSize = Math.min(120, Math.floor(800 / Math.max(locText.length, 1))); 

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
          <h3 
            className="font-black uppercase tracking-tighter leading-none mb-16 whitespace-nowrap"
            style={{ fontSize: `${roleFontSize}px` }}
          >
            {roleText}
          </h3>
          <div className="flex items-end w-full mt-auto mb-8">
            <span className="text-[100px] font-serif mb-2 flex-shrink-0" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
              en
            </span>
            {/* Línea expansible */}
            <div className="flex-1 h-2 bg-black mx-8 mb-6"></div>
            {/* Pin y Ubicación */}
            <div className="flex items-center space-x-6 mb-2 flex-shrink-0 max-w-[800px]">
              <svg className="w-24 h-24 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span 
                className="font-black uppercase tracking-tight leading-none whitespace-nowrap"
                style={{ fontSize: `${locFontSize}px` }}
              >
                {locText}
              </span>
            </div>
          </div>
        </div>

        {/* Inferior */}
        <div className="h-[500px] px-16 pt-24 relative bg-[#C0C0C0]">
          <h4 className="text-[75px] font-serif pl-8 whitespace-nowrap" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
            mirá el anuncio completo
          </h4>
          
          {/* Flecha curvada */}
          <svg className="absolute left-16 top-52 w-[200px] h-[200px]" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="3">
            <path d="M 40 10 C -10 10, -10 90, 40 90" strokeLinecap="round" fill="none" />
            <polygon points="35,80 45,90 35,100" fill="black" stroke="black" strokeWidth="1" />
          </svg>
        </div>
      </div>
    );
  }
);

InstagramStoryTemplate.displayName = 'InstagramStoryTemplate';
