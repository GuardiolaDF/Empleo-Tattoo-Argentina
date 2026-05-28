"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const loginSchema = z.object({
  email: z.string().min(1, { message: "El email es requerido" }).email({ message: "Ingresa un correo electrónico válido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/perfil";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });

      if (result?.error) {
        setError("Credenciales inválidas. Por favor intenta de nuevo.");
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
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
          <h2 className="text-h2 uppercase mb-2">Identificate</h2>
          <p className="text-label-sm">
            Para publicar y administrar tus búsquedas
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {/* Social Auth Buttons */}
          <div className="flex flex-col space-y-4 mb-8">
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full border border-black bg-white text-black py-4 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-button">Continuar con Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative bg-white px-4">
              <span className="text-label-sm border border-border px-2 py-1">O</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-body-sm">
                {error}
              </div>
            )}
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-label-sm text-muted-foreground">
                Email
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
              <span className="text-button">{isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/auth/register" className="text-label-sm text-muted-foreground hover:text-black transition-colors">
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </div>

        {/* Footer Legal */}
        <div className="border-t border-border p-6 text-center">
          <p className="text-caption-sm text-muted-foreground uppercase">
            Al ingresar, aceptás nuestros términos de servicio
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Cargando...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
