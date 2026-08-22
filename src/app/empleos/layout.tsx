import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Bolsa de Trabajo y Empleos de Tatuaje en Argentina | Empleo Tattoo Argentina",
  description: "Encontrá las últimas ofertas de trabajo para tatuadores, perforadores y personal en estudios de tatuaje en toda Argentina.",
  alternates: {
    canonical: "https://empleotattoo.com.ar/empleos",
  },
  openGraph: {
    title: "Bolsa de Trabajo y Empleos de Tatuaje en Argentina",
    description: "Conectá con los mejores estudios de tatuajes del país. Búsquedas laborales activas para tatuadores y perforadores.",
    url: "https://empleotattoo.com.ar/empleos",
    siteName: "Empleo Tattoo Argentina",
    locale: "es_AR",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bolsa de Trabajo y Empleos de Tatuaje en Argentina",
    description: "Búsquedas laborales activas para tatuadores y perforadores.",
    images: ["/og-image.png"],
  },
};

export default function EmpleosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
