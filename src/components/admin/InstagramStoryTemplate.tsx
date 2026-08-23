"use client";

import React, { forwardRef } from 'react';

interface InstagramStoryTemplateProps {
  studioName: string;
  category: string;
  location: string;
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
          <div className="flex flex-col relative w-full">
            <h1 className="text-[110px] leading-[0.9] font-serif" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
              Nueva<br/>publicación
            </h1>
            <div className="absolute -bottom-4 left-0 w-[600px] h-1 bg-black"></div>
          </div>
          {/* Asterisco SVG */}
          <svg className="w-48 h-48 mb-8 flex-shrink-0" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L55 35 L90 20 L70 50 L100 65 L65 70 L70 100 L50 75 L30 100 L35 70 L0 65 L30 50 L10 20 L45 35 Z" />
          </svg>
        </div>

        {/* Medio (Blanco) */}
        <div className="bg-[#EAEAEA] flex-1 px-16 py-24 flex flex-col justify-center">
          <h2 className="text-[130px] font-black uppercase tracking-tight leading-none mb-12">
            {studioName}
          </h2>
          <span className="text-[100px] font-serif mb-12" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
            busca
          </span>
          <h3 className="text-[200px] font-black uppercase tracking-tighter leading-[0.8] mb-16">
            {category}
          </h3>
          <div className="flex items-end space-x-12 relative w-full mt-auto">
            <span className="text-[100px] font-serif" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
              en
            </span>
            <div className="flex items-center space-x-6 flex-1 border-b-[6px] border-black pb-4">
              {/* Location Pin */}
              <svg className="w-32 h-32 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="text-[120px] font-black uppercase tracking-tight leading-none">
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* Inferior */}
        <div className="h-[600px] px-16 pt-24 relative">
          <h4 className="text-[90px] font-serif text-center" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
            mirá el anuncio completo
          </h4>
          
          {/* Flecha curvada (simulada con SVG) */}
          <svg className="absolute left-24 top-48 w-64 h-64" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2">
            <path d="M50 10 Q10 10 10 50 T50 90" />
            <polygon points="50,90 40,85 45,90 40,95" fill="black" />
          </svg>
        </div>
      </div>
    );
  }
);

InstagramStoryTemplate.displayName = 'InstagramStoryTemplate';
