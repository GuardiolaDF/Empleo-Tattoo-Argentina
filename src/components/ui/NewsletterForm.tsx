"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const newsletterSchema = z.object({
  email: z.string()
    .min(1, "Ingresá tu email")
    .email("Ingresá un email válido. Ej: nombre@ejemplo.com"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    mode: "onChange",
    defaultValues: { email: "" }
  });

  const emailValue = watch("email");

  const onSubmit = async (data: NewsletterFormValues) => {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        throw new Error("Error al suscribirse");
      }

      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Hubo un problema. Intenta nuevamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className={`flex flex-col sm:flex-row border ${errors.email || status === 'error' ? 'border-red-500' : 'border-border'}`}>
        <input 
          {...register("email")}
          type="email"
          placeholder="nombre@ejemplo.com"
          disabled={status === "submitting" || status === "success"}
          className="flex-1 px-6 py-4 bg-transparent outline-none text-body placeholder:text-muted-foreground focus:bg-gray-50 transition-colors disabled:opacity-50 disabled:bg-gray-50"
        />
        <button 
          type="submit" 
          disabled={!isValid || !emailValue || status === "submitting" || status === "success"}
          className={`border-l ${errors.email || status === 'error' ? 'border-red-500' : 'border-border'} px-8 py-4 text-button transition-colors whitespace-nowrap 
            ${status === 'success' 
              ? 'bg-green-50 text-green-700 cursor-default' 
              : (!isValid || !emailValue) 
                ? 'bg-gray-100 text-muted-foreground cursor-not-allowed' 
                : 'bg-white text-black hover:bg-muted'
            }
          `}
        >
          {status === "submitting" && "Enviando..."}
          {status === "success" && "¡Enviado!"}
          {(status === "idle" || status === "error") && "Suscribirme →"}
        </button>
      </div>
      {(errors.email || errorMessage) && (
        <span className="text-caption-sm text-red-500 mt-2">
          {errors.email?.message || errorMessage}
        </span>
      )}
    </form>
  );
}
