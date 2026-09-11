import { z } from "zod";

export const tagQuerySchema = z.object({
  categoryId: z.coerce
    .number()
    .int()
    .positive("Category ID tidak valid")
    .optional(),
});

export const createTagSchema = z.object({
  categoryId: z.coerce.number().int().positive("Category ID tidak valid"),

  name: z
    .string()
    .min(2, "Nama tag minimal 2 karakter")
    .max(50, "Nama tag maksimal 50 karakter"),
});

export const tagIdSchema = z.object({
  id: z.coerce.number().int().positive("Tag ID tidak valid"),
});

export const updateTagSchema = z.object({
  categoryId: z.coerce.number().int().positive("Category ID tidak valid"),

  name: z
    .string()
    .min(2, "Nama tag minimal 2 karakter")
    .max(50, "Nama tag maksimal 50 karakter"),
});
