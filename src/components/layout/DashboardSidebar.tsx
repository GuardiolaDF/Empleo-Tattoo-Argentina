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
    <aside className="w-full lg:w-64 bg-white border-r border-border flex flex-col justify-between py-12 flex-shrink-0">
      <div>
        {/* Studio Name */}
        <div className="px-8 mb-12 overflow-hidden w-full">
          <h2 className="text-h3 truncate max-w-full block">
            {studioName || "Tu Estudio"}
          </h2>
          <p className="text-label-sm mt-1 text-muted-foreground">Panel de Control</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-4 px-8 py-4 transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-muted-foreground hover:text-black hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-nav">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-8 flex flex-col space-y-4 mt-16 lg:mt-0">
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
