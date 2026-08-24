"use client";

import React, { useRef, useEffect } from "react";
import { MapPin, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export interface JobCardProps {
  index: number;
  jobId?: string;
  studioName?: string;
  role: string;
  specialty: string;
  location: string;
  metadata?: string[];
}

export function JobCard({ index, jobId, studioName, role, specialty, location, metadata = [] }: JobCardProps) {
  // Checkerboard pattern for a 3-column grid
  const isDark = index % 2 !== 0;
  
  const containerClasses = isDark
    ? "bg-black text-white border border-black"
    : "bg-white text-black border border-black";

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const resizeText = () => {
      if (!containerRef.current || !textRef.current) return;
      
      // We set a large base size to measure natural width accurately
      const baseSize = 60; 
      textRef.current.style.fontSize = `${baseSize}px`;
      
      const containerWidth = containerRef.current.clientWidth;
      const textWidth = textRef.current.scrollWidth;
      
      if (textWidth > 0 && containerWidth > 0) {
        // Calculate the scale needed to perfectly match the container width
        const scale = containerWidth / textWidth;
        // Cap the maximum font size so extremely short words don't become absurdly large
        const finalSize = Math.min(baseSize * scale, 65); 
        textRef.current.style.fontSize = `${finalSize}px`;
      }
    };

    resizeText();
    
    // Create a ResizeObserver to watch for grid changes or window resizing
    const observer = new ResizeObserver(() => {
      // Use requestAnimationFrame to avoid ResizeObserver loop limit errors
      window.requestAnimationFrame(resizeText);
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [role]);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!jobId) return;
    
    const url = `https://empleotattoo.com.ar/empleos/${jobId}`;
    const title = `${role} en ${studioName || 'Estudio'} | Empleo Tattoo Argentina`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col min-h-[340px] p-6 lg:p-8 w-full h-full ${containerClasses}`} 
    >
      {/* Top (Cabecera) */}
      <div className="flex justify-between items-end">
        <span className="font-sans text-sm font-bold uppercase truncate pr-4 leading-none pb-[2px]">
          {studioName || "Estudio"}
        </span>
        <button 
          onClick={handleShare}
          className="hover:opacity-50 transition-opacity flex-shrink-0 leading-none"
          aria-label="Compartir"
        >
          <Share2 className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Center (Protagonista) */}
      <div className="mt-6 lg:mt-8 flex flex-col overflow-hidden" ref={containerRef}>
        <h2 
          ref={textRef}
          className="font-serif font-medium leading-none uppercase whitespace-nowrap origin-left" 
          style={{ fontFamily: 'var(--font-bodoni-moda)' }}
        >
          {role}
        </h2>
        <span className="font-sans text-base mt-2 line-clamp-1">
          {specialty}
        </span>
      </div>
      
      {/* Center-Bottom (Metadatos) */}
      {metadata && metadata.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {metadata.map((tag, i) => (
            <span 
              key={i}
              className={`font-sans text-[10px] uppercase font-medium tracking-[0.2em] border px-2 py-1 ${
                isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom (Anclaje inferior) */}
      <div className="mt-auto pt-8 flex items-center gap-2">
        <MapPin className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
        <span className="font-sans text-xs sm:text-sm font-medium truncate">
          {location}
        </span>
      </div>
    </motion.div>
  );
}

