"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, { message: "El nombre es requerido" }),
  email: z.string().min(1, { message: "El email es requerido" }).email({ message: "Ingresa un correo electrónico válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Ocurrió un error al registrarse");
      } else {
        // Redirigir al login con mensaje de éxito (podría hacerse via query param)
        router.push("/auth/login?registered=true");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión. Inténtalo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md border border-border">
        {/* Header Section */}
        <div className="px-8 pt-12 pb-8 border-b border-border text-center md:text-left">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-label font-bold">ETA</h1>
          </Link>
          <h2 className="text-h2 uppercase mb-2">Crear Cuenta</h2>
          <p className="text-label-sm">
            Únete a la comunidad de artistas y estudios
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-body-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-label-sm text-muted-foreground">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                placeholder="Tu nombre"
                {...register("name")}
                className={`border-b ${errors.name ? 'border-red-500' : 'border-border focus:border-black'} py-3 outline-none text-body bg-transparent transition-colors`}
              />
              {errors.name && (
                <p className="text-caption-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-label-sm text-muted-foreground">
                Email Profesional
              </label>
              <input
                id="email"
                type="email"
                placeholder="artista@estudio.com"
                {...register("email")}
                className={`border-b ${errors.email ? 'border-red-500' : 'border-border focus:border-black'} py-3 outline-none text-body bg-transparent transition-colors`}
              />
              {errors.email && (
                <p className="text-caption-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-label-sm text-muted-foreground">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={`border-b ${errors.password ? 'border-red-500' : 'border-border focus:border-black'} py-3 outline-none text-body bg-transparent transition-colors`}
              />
              {errors.password && (
                <p className="text-caption-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-black text-white py-4 flex items-center justify-center space-x-2 transition-colors ${isLoading ? "opacity-70 cursor-wait" : "hover:bg-black/90"}`}
            >
              <span className="text-button">{isLoading ? "Creando cuenta..." : "Crear cuenta"}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link href="/auth/login" className="text-label-sm text-muted-foreground hover:text-black transition-colors">
              ¿Ya tienes cuenta? Inicia Sesión
            </Link>
          </div>
        </div>

        {/* Footer Legal */}
        <div className="border-t border-border p-6 text-center">
          <p className="text-caption-sm text-muted-foreground uppercase">
            Al registrarte, aceptás nuestros términos de servicio
          </p>
        </div>
      </div>
    </div>
  );
}
