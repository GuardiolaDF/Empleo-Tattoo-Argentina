"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect, useCallback } from "react";

export function Navbar() {
  const pathname = usePathname() || "";
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileMenuOpen]);

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
    <>
    <nav className="w-full flex items-center justify-between h-[var(--navbar-height)] px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-border/50">
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
                  Panel de Estudio
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
            Acceso Estudios
          </Link>
        )}

        <button
          className="md:hidden p-3 -mr-1 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-visibility duration-300 ${
          mobileMenuOpen ? "visible" : "invisible delay-300"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobileMenu}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[85vw] max-w-sm bg-white shadow-xl transition-transform duration-300 ease-editorial ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-end h-[var(--navbar-height)] px-4">
            <button
              onClick={closeMobileMenu}
              className="p-3 -mr-1 text-foreground"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex flex-col px-6">
            {/* Nav Links */}
            <div className="flex flex-col">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={`py-3 text-lg border-b border-border/30 transition-colors duration-200 ${
                      isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-border my-4" />

            {/* CTA */}
            <Link
              href="/publicar-empleo"
              onClick={closeMobileMenu}
              className="w-full bg-primary text-primary-foreground text-center px-6 py-3 text-button hover:opacity-90 transition-opacity duration-200"
            >
              Publicar Aviso
            </Link>

            {/* Auth Section */}
            <div className="mt-4 flex flex-col gap-1">
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard/perfil"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 py-3 text-body-sm text-foreground"
                  >
                    <User className="w-5 h-5" />
                    Panel de Estudio
                  </Link>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-3 py-3 text-body-sm text-red-600 text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={closeMobileMenu}
                  className="w-full text-center border border-border px-4 py-3 text-nav text-muted-foreground hover:text-foreground transition-colors"
                >
                  Acceso Estudios
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
