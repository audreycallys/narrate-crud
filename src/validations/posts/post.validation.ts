import { z } from "zod";

export const createPostSchema = z.object({
  categoryId: z.coerce.number().int().positive("Category wajib dipilih"),

  title: z
    .string()
    .min(3, "Title minimal 3 karakter")
    .max(255, "Title maksimal 255 karakter"),

  content: z.string().min(10, "Content minimal 10 karakter"),

  status: z
    .enum(["draft", "published", "archived"])
    .optional()
    .default("draft"),
});

export const postIdSchema = z.object({
  id: z.coerce.number().int().positive("Post ID tidak valid"),
});

export const updatePostSchema = z.object({
  categoryId: z.coerce.number().int().positive("Category wajib dipilih"),

  title: z
    .string()
    .min(3, "Title minimal 3 karakter")
    .max(255, "Title maksimal 255 karakter"),

  content: z.string().min(10, "Content minimal 10 karakter"),

  status: z.enum(["draft", "published", "archived"]),
});
