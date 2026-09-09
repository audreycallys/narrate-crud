import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nama category minimal 2 karakter")
    .max(100, "Nama category maksimal 100 karakter"),

  description: z.string().optional(),
});
