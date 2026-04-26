import type { Metadata } from "next";
import { Inter, Bodoni_Moda } from "next/font/google";
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
  title: "Empleo Tattoo Argentina",
  description: "Conectando estudios y artistas en toda la Argentina",
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
        {children}
      </body>
    </html>
  );
}
