import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  LayoutGrid, 
  Briefcase, 
  Users, 
  BarChart, 
  Settings, 
  HelpCircle, 
  LogOut 
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F4F4]">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row border-t border-border">
        
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 bg-white border-r border-border flex flex-col justify-between py-12 flex-shrink-0">
          <div>
            <div className="px-8 mb-12">
              <h2 className="font-serif text-xl tracking-tight uppercase font-bold">Ink & Concrete</h2>
              <p className="font-sans text-[10px] tracking-widest text-muted-foreground uppercase mt-1">Est. 2015</p>
            </div>
            
            <nav className="flex flex-col space-y-2">
              <Link href="/dashboard" className="flex items-center space-x-4 px-8 py-4 bg-black text-white">
                <LayoutGrid className="w-4 h-4" />
                <span className="font-sans text-[10px] tracking-widest uppercase">Active Listings</span>
              </Link>
              <Link href="#" className="flex items-center space-x-4 px-8 py-4 text-muted-foreground hover:text-black transition-colors">
                <Briefcase className="w-4 h-4" />
                <span className="font-sans text-[10px] tracking-widest uppercase">Dashboard</span>
              </Link>
              <Link href="#" className="flex items-center space-x-4 px-8 py-4 text-muted-foreground hover:text-black transition-colors">
                <Users className="w-4 h-4" />
                <span className="font-sans text-[10px] tracking-widest uppercase">Artist Applications</span>
              </Link>
              <Link href="#" className="flex items-center space-x-4 px-8 py-4 text-muted-foreground hover:text-black transition-colors">
                <BarChart className="w-4 h-4" />
                <span className="font-sans text-[10px] tracking-widest uppercase">Studio Analytics</span>
              </Link>
              <Link href="#" className="flex items-center space-x-4 px-8 py-4 text-muted-foreground hover:text-black transition-colors">
                <Settings className="w-4 h-4" />
                <span className="font-sans text-[10px] tracking-widest uppercase">Account Settings</span>
              </Link>
            </nav>
          </div>

          <div className="px-8 flex flex-col space-y-6 mt-16 lg:mt-0">
            <button className="w-full bg-black text-white py-4 flex items-center justify-center hover:bg-black/90 transition-colors">
              <span className="font-sans text-[10px] tracking-widest uppercase">New Portfolio Upload</span>
            </button>
            <Link href="#" className="flex items-center space-x-4 text-muted-foreground hover:text-black transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="font-sans text-[10px] tracking-widest uppercase">Support</span>
            </Link>
            <Link href="#" className="flex items-center space-x-4 text-muted-foreground hover:text-black transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="font-sans text-[10px] tracking-widest uppercase">Logout</span>
            </Link>
          </div>
        </aside>

        {/* Center Column: Mis Anuncios */}
        <section className="flex-1 p-8 md:p-16">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight uppercase mb-12">Mis Anuncios</h1>
          
          <div className="bg-white border border-border">
            
            {/* Listing 1 (Active) */}
            <div className="p-8 md:p-12 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-3 block">24 Oct 2024</span>
                <h3 className="font-serif text-2xl tracking-tight uppercase mb-4 max-w-md">Artista Residente Blackwork/Tradicional</h3>
                <div className="flex items-center space-x-4">
                  <span className="bg-black text-white px-2 py-1 font-sans text-[8px] tracking-[0.2em] uppercase">Activo</span>
                  <span className="font-sans text-[10px] tracking-widest text-muted-foreground uppercase">Madrid, Centro</span>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-4 text-right">
                <button className="font-sans text-[10px] tracking-widest uppercase hover:underline">Editar</button>
                <button className="font-sans text-[10px] tracking-widest text-muted-foreground uppercase hover:text-black transition-colors">Pausar</button>
              </div>
            </div>

            {/* Listing 2 (Active) */}
            <div className="p-8 md:p-12 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-3 block">15 Sep 2024</span>
                <h3 className="font-serif text-2xl tracking-tight uppercase mb-4 max-w-md">Guest Spot Noviembre 2024</h3>
                <div className="flex items-center space-x-4">
                  <span className="bg-black text-white px-2 py-1 font-sans text-[8px] tracking-[0.2em] uppercase">Activo</span>
                  <span className="font-sans text-[10px] tracking-widest text-muted-foreground uppercase">Barcelona, Gòtic</span>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-4 text-right">
                <button className="font-sans text-[10px] tracking-widest uppercase hover:underline">Editar</button>
                <button className="font-sans text-[10px] tracking-widest text-muted-foreground uppercase hover:text-black transition-colors">Pausar</button>
              </div>
            </div>

            {/* Listing 3 (Expired) */}
            <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 opacity-60">
              <div>
                <span className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-3 block">02 Ene 2024</span>
                <h3 className="font-serif text-2xl tracking-tight uppercase mb-4 max-w-md text-muted-foreground">Aprendiz de Estudio Full Time</h3>
                <div className="flex items-center space-x-4">
                  <span className="border border-border text-muted-foreground px-2 py-1 font-sans text-[8px] tracking-[0.2em] uppercase bg-gray-50">Expirado</span>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-4 text-right">
                <button className="font-sans text-[10px] tracking-widest text-muted-foreground uppercase hover:text-black transition-colors">Reactivar</button>
              </div>
            </div>

          </div>
        </section>

        {/* Right Panel: Stats & Profile */}
        <aside className="w-full lg:w-80 p-8 md:p-16 lg:pl-0 flex flex-col space-y-8 flex-shrink-0">
          
          {/* Vistas Totales */}
          <div className="bg-white border border-border p-8 text-center">
            <span className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-4 block">Vistas Totales</span>
            <span className="font-serif text-6xl tracking-tighter">14.2k</span>
          </div>

          {/* Clics al Contacto */}
          <div className="bg-white border border-border p-8 text-center">
            <span className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-4 block">Clics al Contacto</span>
            <span className="font-serif text-6xl tracking-tighter">892</span>
          </div>

          {/* Perfil del Estudio */}
          <div className="bg-white border border-border p-8">
            <h3 className="font-serif text-xl tracking-tight uppercase mb-8 text-center">Perfil del Estudio</h3>
            
            <form className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[8px] tracking-[0.2em] text-muted-foreground uppercase">Nombre del Estudio</label>
                <input 
                  type="text" 
                  defaultValue="VOID TATTOO CLUB"
                  className="border-b border-border py-2 font-sans text-xs uppercase outline-none focus:border-black transition-colors bg-transparent"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[8px] tracking-[0.2em] text-muted-foreground uppercase">Ubicación</label>
                <input 
                  type="text" 
                  defaultValue="MADRID, ESPAÑA"
                  className="border-b border-border py-2 font-sans text-xs uppercase outline-none focus:border-black transition-colors bg-transparent"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-sans text-[8px] tracking-[0.2em] text-muted-foreground uppercase">Instagram</label>
                <input 
                  type="text" 
                  defaultValue="@VOIDTATTOOCLUB"
                  className="border-b border-border py-2 font-sans text-xs uppercase outline-none focus:border-black transition-colors bg-transparent"
                />
              </div>

              <button 
                type="button" 
                className="w-full bg-black text-white py-4 mt-4 flex items-center justify-center hover:bg-black/90 transition-colors"
              >
                <span className="font-sans text-[10px] tracking-widest uppercase">Actualizar Datos</span>
              </button>
            </form>
          </div>

        </aside>
      </main>

      <Footer />
    </div>
  );
}
