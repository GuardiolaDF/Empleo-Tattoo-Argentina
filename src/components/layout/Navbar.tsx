"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

export function Navbar() {
  const pathname = usePathname() || "";

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
                <span className={`absolute bottom-0 left-1/2 h-px bg-black transition-all duration-300 ease-out -translate-x-1/2 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </span>
            </Link>
          );
        })}
      </div>

      {/* CTA & Mobile Menu Toggle */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/publicar-empleo"
          className="hidden md:block bg-primary text-primary-foreground px-6 py-3 text-button hover:bg-black/90 transition-colors"
        >
          Publicar Empleo
        </Link>
        <button className="md:hidden p-2 text-foreground">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
