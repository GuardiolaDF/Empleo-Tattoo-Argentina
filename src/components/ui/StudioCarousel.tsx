"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface CarouselImage {
  src: string;
  alt: string;
  position?: string;
}

interface StudioCarouselProps {
  images: CarouselImage[];
}

export function StudioCarousel({ images }: StudioCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number>(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, handlePrev, handleNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50) {
      handleNext();
    } else if (delta > 50) {
      handlePrev();
    }
  };

  return (
    <>
      {/* Main Carousel Track */}
      <div
        className="relative w-full h-[280px] sm:h-[380px] md:h-[450px] border border-border overflow-hidden bg-gray-100 group cursor-pointer"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Images track */}
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="w-full h-full flex-shrink-0 relative group/img"
              onClick={() => setIsLightboxOpen(true)}
            >
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                style={{ objectPosition: img.position || "center" }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-black/75 text-white px-4 py-2 flex items-center space-x-2 rounded-full text-xs font-semibold uppercase tracking-wider">
                  <Maximize2 className="w-4 h-4" />
                  <span>Ver en Tamaño Completo</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white border border-black flex items-center justify-center text-black hover:bg-gray-50 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white border border-black flex items-center justify-center text-black hover:bg-gray-50 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`w-3 h-3 md:w-2 md:h-2 p-1 ${idx === currentIndex ? 'bg-black' : 'bg-black/30'} transition-colors border border-black/10`}
                  aria-label={`Ir a imagen ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8 animate-fade-in">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50"
            aria-label="Cerrar vista completa"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter Badge */}
          <div className="absolute top-6 left-6 text-white/70 text-xs uppercase font-bold tracking-widest bg-white/10 px-4 py-2 rounded-full z-50">
            Foto {currentIndex + 1} de {images.length}
          </div>

          {/* Previous Arrow */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors z-50"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Main Uncropped Image Display */}
          <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              width={1600}
              height={1200}
              unoptimized
              className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain select-none shadow-2xl transition-all duration-300"
            />
          </div>

          {/* Next Arrow */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors z-50"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Bottom Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-[10px] uppercase tracking-widest">
            Usa las flechas o presiona ESC para salir
          </div>
        </div>
      )}
    </>
  );
}
