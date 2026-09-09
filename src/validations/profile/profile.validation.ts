import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),

  email: z.string().email("Email tidak valid").optional(),

  bio: z.string().optional(),
});
