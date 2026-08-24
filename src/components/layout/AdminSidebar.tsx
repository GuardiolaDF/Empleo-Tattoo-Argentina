"use client";

import React, { useState } from "react";
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
  Globe,
  Smartphone,
  Menu,
  X
} from "lucide-react";

interface AdminSidebarProps {
  userEmail?: string | null;
}

const adminNavItems = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/avisos", label: "Moderación de Avisos", icon: Briefcase },
  { href: "/admin/estudios", label: "Estudios Registrados", icon: Building2 },
  { href: "/admin/cupones", label: "Gestión de Cupones", icon: Ticket },
  { href: "/admin/marketing", label: "Marketing & RRSS", icon: Smartphone },
  { href: "/admin/finanzas", label: "Control Financiero", icon: CreditCard },
  { href: "/admin/transacciones", label: "Pagos & Webhooks", icon: CreditCard },
  { href: "/admin/metricas", label: "Analítica & Salud", icon: TrendingUp },
  { href: "/admin/recuperacion", label: "Checkouts Perdidos", icon: ShoppingCart },
];

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b-2 border-black px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-black" />
          <span className="font-black uppercase text-lg tracking-tight">ETA Admin</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-black text-white hover:bg-black/80 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-[80%] max-w-sm lg:w-72 bg-white flex flex-col justify-between flex-shrink-0 min-h-screen border-r-2 border-black
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="overflow-y-auto">
          {/* Header Admin */}
          <div className="p-6 border-b-2 border-black bg-gray-50">
            <div className="flex items-center gap-2 text-black text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>ETA Control Room</span>
            </div>
            <h1 className="text-xl font-black text-black uppercase tracking-tight font-serif" style={{ fontFamily: 'var(--font-bodoni-moda)' }}>
              Dashboard
            </h1>
            {userEmail && (
              <p className="text-xs text-muted-foreground truncate mt-1 font-bold" title={userEmail}>
                {userEmail}
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {adminNavItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-2 border-transparent ${
                    isActive
                      ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]"
                      : "text-muted-foreground hover:text-black hover:border-black hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-black"}`} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Actions */}
        <div className="p-4 border-t-2 border-black space-y-2 bg-gray-50 mt-auto">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"
          >
            <Globe className="w-4 h-4" />
            <span>Ver Web Pública ↗</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white bg-red-600 border-2 border-black hover:bg-red-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
