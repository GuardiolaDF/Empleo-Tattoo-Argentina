"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Ticket,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  LogOut,
  ShieldCheck,
  Globe
} from "lucide-react";

interface AdminSidebarProps {
  userEmail?: string | null;
}

const adminNavItems = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/avisos", label: "Moderación de Avisos", icon: Briefcase },
  { href: "/admin/estudios", label: "Estudios Registrados", icon: Building2 },
  { href: "/admin/cupones", label: "Gestión de Cupones", icon: Ticket },
  { href: "/admin/transacciones", label: "Pagos & Webhooks", icon: CreditCard },
  { href: "/admin/metricas", label: "Analítica & Salud B2B", icon: TrendingUp },
  { href: "/admin/recuperacion", label: "Checkouts Abandonados", icon: ShoppingCart },
];


export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 bg-black text-white flex flex-col justify-between flex-shrink-0 min-h-screen border-r border-zinc-800">
      <div>
        {/* Header Admin */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ETA Control Room</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          {userEmail && (
            <p className="text-xs text-zinc-400 truncate mt-1" title={userEmail}>
              {userEmail}
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {adminNavItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <Globe className="w-4 h-4 text-sky-400" />
          <span>Ver Sitio Web Público ↗</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
