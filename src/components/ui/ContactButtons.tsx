"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ContactButtonsProps {
  whatsapp: string;
  instagram: string;
  studioUserId?: string;
  jobId?: string;
}

export function ContactButtons({ whatsapp, instagram, studioUserId, jobId }: ContactButtonsProps) {
  // Extract handle cleanly if a full URL or @ format was passed
  const cleanInstagram = instagram.replace('@', '').replace('https://instagram.com/', '').replace('https://www.instagram.com/', '');
  // Extract numbers only for WhatsApp URL
  const cleanWhatsapp = whatsapp.replace(/\D/g, '');

  const handleWhatsAppClick = () => {
    if (studioUserId) {
      trackEvent('whatsapp_click', studioUserId, jobId);
    }
  };

  const handleInstagramClick = () => {
    if (studioUserId) {
      trackEvent('instagram_click', studioUserId, jobId);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <a 
        href={`https://wa.me/${cleanWhatsapp}`} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className="w-full border border-black bg-transparent text-black py-5 flex items-center justify-between px-6 hover:bg-black/5 transition-colors"
      >
        <span className="text-button">WhatsApp</span>
        <ArrowRight className="w-4 h-4" />
      </a>
      <a 
        href={`https://instagram.com/${cleanInstagram}`} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleInstagramClick}
        className="w-full border border-black bg-transparent text-black py-5 flex items-center justify-between px-6 hover:bg-black/5 transition-colors"
      >
        <span className="text-button">Instagram Perfil</span>
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
