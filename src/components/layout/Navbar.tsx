import Link from "next/link";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-8 px-4 md:px-8 bg-transparent">
      {/* Logo */}
      <Link href="/" className="font-serif text-3xl font-bold tracking-tight">
        ETA
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-12 text-xs font-sans tracking-widest uppercase text-foreground">
        <Link href="/artistas" className="border-b border-foreground pb-1">Artistas</Link>
        <Link href="/estudios" className="text-muted-foreground hover:text-foreground pb-1 transition-colors">Estudios</Link>
        <Link href="/convenciones" className="text-muted-foreground hover:text-foreground pb-1 transition-colors">Convenciones</Link>
        <Link href="/academia" className="text-muted-foreground hover:text-foreground pb-1 transition-colors">Academia</Link>
      </div>

      {/* CTA & Mobile Menu Toggle */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/publicar-empleo"
          className="hidden md:block bg-primary text-primary-foreground px-6 py-3 text-xs tracking-widest uppercase font-sans hover:bg-black/90 transition-colors"
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
