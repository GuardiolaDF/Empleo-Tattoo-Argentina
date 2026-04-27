"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().min(1, { message: "El email es requerido" }).email({ message: "Ingresa un correo electrónico válido" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    // Placeholder for actual auth logic
    console.log("Magic link requested for:", data.email);
    alert(`Link mágico enviado a: ${data.email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md border border-border">
        {/* Header Section */}
        <div className="px-8 pt-12 pb-8 border-b border-border text-center md:text-left">
          <Link href="/" className="inline-block mb-8">
            <h1 className="font-serif text-3xl font-bold tracking-tight">ETA</h1>
          </Link>
          <h2 className="font-serif text-4xl tracking-tighter uppercase mb-2">Identificate</h2>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Para publicar y administrar tus búsquedas
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {/* Social Auth Buttons */}
          <div className="flex flex-col space-y-4 mb-8">
            <button className="w-full border border-black bg-white text-black py-4 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-sans text-xs tracking-widest uppercase">Continuar con Google</span>
            </button>
            <button className="w-full bg-black text-white py-4 flex items-center justify-center space-x-3 hover:bg-black/90 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              <span className="font-sans text-xs tracking-widest uppercase">Continuar con Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative bg-white px-4">
              <span className="font-sans text-[10px] tracking-widest text-muted-foreground uppercase border border-border px-2 py-1">O</span>
            </div>
          </div>

          {/* Magic Link Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                Email Profesional
              </label>
              <input
                id="email"
                type="email"
                placeholder="artista@estudio.com"
                {...register("email")}
                className={`border-b ${errors.email ? 'border-red-500' : 'border-border focus:border-black'} py-3 outline-none font-sans text-sm bg-transparent transition-colors`}
              />
              {errors.email && (
                <p className="font-sans text-[10px] text-red-500 tracking-wide mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 flex items-center justify-center space-x-2 hover:bg-black/90 transition-colors"
            >
              <span className="font-sans text-xs tracking-widest uppercase">Enviar Link Mágico</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Legal */}
        <div className="border-t border-border p-6 text-center">
          <p className="font-sans text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
            Al ingresar, aceptás nuestros términos de servicio
          </p>
        </div>
      </div>
    </div>
  );
}
