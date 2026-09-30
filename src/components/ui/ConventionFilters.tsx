"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ConventionFiltersProps {
  status: string;
  province?: string;
}

export default function ConventionFilters({ status, province }: ConventionFiltersProps) {
  const router = useRouter();

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvince = e.target.value;
    if (newProvince) {
      router.push(`/convenciones?status=${status}&province=${newProvince}`);
    } else {
      router.push(`/convenciones?status=${status}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 w-full mx-auto px-8 md:px-12 lg:px-16">
      <div className="flex gap-6">
        <Link 
          href={`/convenciones?status=próximas${province ? `&province=${province}` : ''}`}
          className={`text-label-sm uppercase tracking-wider pb-4 border-b-2 transition-colors ${status === 'próximas' ? 'border-black text-black' : 'border-transparent text-muted-foreground hover:text-black'}`}
        >
          Próximas
        </Link>
        <Link 
          href={`/convenciones?status=pasadas${province ? `&province=${province}` : ''}`}
          className={`text-label-sm uppercase tracking-wider pb-4 border-b-2 transition-colors ${status === 'pasadas' ? 'border-black text-black' : 'border-transparent text-muted-foreground hover:text-black'}`}
        >
          Pasadas
        </Link>
      </div>

      <div className="relative w-full sm:w-auto">
        <select 
          value={province || ""}
          onChange={handleProvinceChange}
          className="w-full sm:w-64 bg-white border border-border text-black text-body-sm rounded-none focus:ring-1 focus:ring-black focus:border-black block p-3"
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
  );
}
