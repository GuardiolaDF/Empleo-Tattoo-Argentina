"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutGrid,
  Settings,
  BarChart3,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface DashboardSidebarProps {
  studioName?: string;
}

const navItems = [
  { href: "/dashboard", label: "Mis Publicaciones", icon: LayoutGrid },
  { href: "/dashboard/perfil", label: "Perfil del Estudio", icon: Settings },
  { href: "/dashboard/estadisticas", label: "Estadísticas", icon: BarChart3 },
];

export function DashboardSidebar({ studioName }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 bg-white lg:border-r border-border flex lg:flex-col lg:justify-between flex-shrink-0 border-b lg:border-b-0 lg:py-12">
      <div className="w-full lg:w-auto">
        {/* Studio Name */}
        <div className="hidden lg:block px-8 mb-12 overflow-hidden w-full">
          <h2 className="text-h3 truncate max-w-full block">
            {studioName || "Tu Estudio"}
          </h2>
          <p className="text-label-sm mt-1 text-muted-foreground">Panel de Control</p>
        </div>

        {/* Navigation */}
        <nav
          className="flex lg:flex-col lg:space-y-1 overflow-x-auto lg:overflow-x-visible"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start px-4 lg:px-8 py-3 lg:py-4 min-w-[80px] lg:min-w-0 gap-1 lg:gap-0 lg:space-x-4 whitespace-nowrap lg:whitespace-normal transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-muted-foreground hover:text-black hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5 lg:w-4 lg:h-4" />
                <span className="text-[10px] lg:text-nav">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="hidden lg:flex px-8 flex-col space-y-4">
        <Link
          href="/contacto"
          className="flex items-center space-x-4 text-muted-foreground hover:text-black transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-nav">Soporte</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center space-x-4 text-muted-foreground hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-nav">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
