import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres").max(120, "El título no puede superar los 120 caracteres"),
  studioName: z.string().trim().min(2, "El nombre del estudio debe tener al menos 2 caracteres").max(100),
  location: z.string().trim().min(2, "La ubicación debe tener al menos 2 caracteres").max(100),
  description: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres").max(5000),
  category: z.string().trim().min(2).max(50),
  style: z.string().trim().max(50).optional(),
  price: z.number().positive("El precio debe ser un número positivo").optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const studioSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
  anio: z.string().trim().min(4).max(4),
  ubicacion: z.string().trim().min(2).max(100),
  bio: z.string().trim().min(10).max(2000),
  instagram: z.string().trim().max(100),
  whatsapp: z.string().trim().max(50),
  countryCode: z.string().trim().max(10).default('54'),
  website: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.length > 0 && !/^https?:\/\//i.test(val)) {
        return `https://${val}`;
      }
      return val;
    },
    z.string().trim().url("Debe ser una URL válida").or(z.literal(''))
  ).optional(),
  especialidades: z.array(z.string().trim().max(50)).optional().default([]),
  fotos: z.array(z.string().url()).optional().default([]),
  portada: z.string().url().or(z.literal('')).optional(),
});
