"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname() || "";
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/artistas", label: "Artistas" },
    { href: "/estudios", label: "Estudios" },
    { href: "/convenciones", label: "Convenciones" },
    { href: "/academia", label: "Academia" },
  ];

  return (
    <nav className="w-full flex items-center justify-between h-[var(--navbar-height)] px-4 md:px-8 bg-transparent">
      {/* Logo */}
      <Link href="/" className="text-h2 font-bold">
        ETA
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-12 text-nav">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link 
              key={href}
              href={href} 
              aria-current={isActive ? "page" : undefined}
              className={`relative group transition-colors duration-200 focus:outline focus:outline-1 focus:outline-black focus:outline-offset-4 ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="relative pb-1">
                {label}
                <span className={`absolute bottom-0 left-1/2 h-px bg-black transition-all duration-300 ease-editorial -translate-x-1/2 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </span>
            </Link>
          );
        })}
      </div>

      {/* CTA & User Menu */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/publicar-empleo"
          className="hidden md:block bg-primary text-primary-foreground px-6 py-3 text-button hover:opacity-90 transition-opacity duration-200 ease-editorial"
        >
          Publicar Aviso
        </Link>

        {session?.user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="hidden md:flex items-center space-x-2 border border-border px-4 py-2 hover:bg-black/5 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-nav truncate max-w-[120px]">
                {session.user.name?.split(' ')[0] || 'Mi Cuenta'}
              </span>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border shadow-dropdown z-50">
                <Link
                  href="/dashboard/perfil"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full px-4 py-3 text-left text-body-sm hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-border/50"
                >
                  <User className="w-4 h-4" />
                  Mi Estudio
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full px-4 py-3 text-left text-body-sm hover:bg-gray-50 transition-colors flex items-center gap-3 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/auth/login"
            className="hidden md:block border border-border px-4 py-2 text-nav text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors"
          >
            Ingresar
          </Link>
        )}

        <button className="md:hidden p-2 text-foreground">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
