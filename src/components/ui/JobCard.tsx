"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const cardStyles = [
  { bg: "bg-card-1", text: "text-foreground", muted: "text-muted" }, // Tone 1: white
  { bg: "bg-card-2", text: "text-white", muted: "text-gray-400" },   // Tone 2: near black
  { bg: "bg-card-4", text: "text-white", muted: "text-gray-400" },   // Tone 4: dark gray
  { bg: "bg-card-3", text: "text-foreground", muted: "text-muted" }, // Tone 3: white
];

export interface JobCardProps {
  index: number;
  studioName?: string;
  role: string;
  specialty: string;
  location: string;
}

export function JobCard({ index, studioName, role, specialty, location }: JobCardProps) {
  const pattern = [0, 1, 1, 2];
  const style = cardStyles[pattern[index % 4]];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1],
        y: { type: "spring", stiffness: 200, damping: 20 }
      }}
      className={`group flex flex-col p-6 sm:p-8 md:p-12 justify-between aspect-[3/4] sm:aspect-square md:aspect-[4/3] overflow-hidden border border-border ${style.bg} ${style.text} w-full h-full`} 
    >
      <div className="relative z-10 flex flex-col">
        <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold uppercase leading-[0.8] tracking-tighter mb-6 sm:mb-12 truncate">{studioName}</h3>
        
        <div className="flex flex-col space-y-2">
          <span className={`text-label lowercase font-normal tracking-[0.2em] ${style.muted}`}>busca</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal leading-tight">{role}</h2>
          <span className={`text-base font-serif italic ${style.muted}`}>{specialty}</span>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col space-y-2 mt-6 sm:mt-12">
        <span className={`text-label lowercase font-normal tracking-[0.2em] ${style.muted}`}>en</span>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-sans font-normal truncate">{location}</span>
        </div>
      </div>
    </motion.div>
  );
}
