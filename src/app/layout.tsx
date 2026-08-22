import type { Metadata } from "next";
import { Inter, Bodoni_Moda } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://empleotattoo.com.ar"),
  title: {
    default: "Empleo Tattoo Argentina | Conectando estudios y artistas",
    template: "%s | Empleo Tattoo Argentina"
  },
  description: "La plataforma líder en Argentina para conectar estudios de tatuaje con artistas del tatuaje, perforadores y profesionales del rubro.",
  keywords: ["tatuaje", "empleo tatuaje", "tattoo artist", "tatuador", "estudio de tatuajes", "trabajo tatuador", "perforador", "body piercing", "Argentina"],
  authors: [{ name: "Empleo Tattoo Argentina", url: "https://empleotattoo.com.ar" }],
  creator: "Empleo Tattoo Argentina",
  publisher: "Empleo Tattoo Argentina",
  verification: {
    google: "TejyE-zc_Qc-TdaRqrfyafqhRf_gfNeu9r9KjLhhn_Y",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://empleotattoo.com.ar",
    siteName: "Empleo Tattoo Argentina",
    title: "Empleo Tattoo Argentina | Conectando estudios y artistas",
    description: "Encontrá trabajo o a tu próximo residente en el principal directorio de empleos para estudios de tatuaje en toda Argentina.",
    images: [
      {
        url: "https://empleotattoo.com.ar/api/og/general?ext=.png",
        width: 1200,
        height: 630,
        alt: "Empleo Tattoo Argentina",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empleo Tattoo Argentina",
    description: "Conectando estudios y artistas en toda la Argentina.",
    images: ["https://empleotattoo.com.ar/api/og/general?ext=.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${bodoniModa.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans text-foreground bg-background">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-WVSC325Z"
            height="0" 
            width="0" 
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <AuthProvider>{children}</AuthProvider>
        <Analytics />
        
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WVSC325Z');
          `}
        </Script>
        {/* End Google Tag Manager */}

        {process.env.NEXT_PUBLIC_CLARITY_ID && /^[a-zA-Z0-9]+$/.test(process.env.NEXT_PUBLIC_CLARITY_ID) && (
          <Script id="clarity-script" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `}
          </Script>
        )}

      </body>
    </html>
  );
}

