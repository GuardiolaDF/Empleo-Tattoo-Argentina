"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselImage {
  src: string;
  alt: string;
}

interface StudioCarouselProps {
  images: CarouselImage[];
}

export function StudioCarousel({ images }: StudioCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[400px] border border-border overflow-hidden bg-gray-100 group">
      {/* Images track */}
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={img.src} 
              alt={img.alt} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-black flex items-center justify-center text-black hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-black flex items-center justify-center text-black hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 ${idx === currentIndex ? 'bg-black' : 'bg-black/30'} transition-colors border border-black/10`}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
