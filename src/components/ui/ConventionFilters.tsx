"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface ConventionFiltersProps {
  status: string;
  province?: string;
}

export default function ConventionFilters({ status, province }: ConventionFiltersProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvince = e.target.value;
    if (newProvince) {
      router.push(`/convenciones?status=${status}&province=${newProvince}`);
    } else {
      router.push(`/convenciones?status=${status}`);
    }
    setIsOpen(false);
  };

  return (
    <div className="w-full mx-auto px-6 md:px-12 lg:px-16 py-4 bg-white relative z-50 border-b lg:border-b-0 border-gray-100">
      {/* Mobile Toggle */}
      <div className="flex justify-between items-center sm:hidden">
        <span className="text-black font-black uppercase tracking-widest text-lg">Filtros</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center p-2 text-black bg-gray-100"
        >
          {isOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
        </button>
      </div>

      {/* Filters Container */}
      <div className={`${isOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4 mt-6 sm:mt-0 w-full`}>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto border-b sm:border-none border-gray-200 pb-4 sm:pb-0">
          <Link 
            href={`/convenciones?status=próximas${province ? `&province=${province}` : ''}`}
            onClick={() => setIsOpen(false)}
            className={`text-label-sm uppercase tracking-wider sm:pb-4 border-l-4 sm:border-l-0 sm:border-b-2 pl-4 sm:pl-0 transition-colors ${status === 'próximas' ? 'border-black text-black' : 'border-transparent text-muted-foreground hover:text-black'}`}
          >
            Próximas
          </Link>
          <Link 
            href={`/convenciones?status=pasadas${province ? `&province=${province}` : ''}`}
            onClick={() => setIsOpen(false)}
            className={`text-label-sm uppercase tracking-wider sm:pb-4 border-l-4 sm:border-l-0 sm:border-b-2 pl-4 sm:pl-0 transition-colors ${status === 'pasadas' ? 'border-black text-black' : 'border-transparent text-muted-foreground hover:text-black'}`}
          >
            Pasadas
          </Link>
        </div>

        <div className="relative w-full sm:w-auto">
          <select 
            value={province || ""}
            onChange={handleProvinceChange}
            className="w-full sm:w-64 bg-white border-2 border-black text-black font-bold uppercase tracking-widest text-xs rounded-none focus:ring-0 focus:outline-none block p-3"
          >
            <option value="">Todas las provincias</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="CABA">CABA</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Santa Fe">Santa Fe</option>
            <option value="Mendoza">Mendoza</option>
          </select>
        </div>
      </div>
    </div>
  );
}
