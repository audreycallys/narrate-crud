import { z } from "zod";

export const createCommentSchema = z.object({
  authorName: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),

  authorEmail: z.string().email("Email tidak valid").optional(),

  comment: z.string().min(2, "Komentar minimal 2 karakter"),
});

export const postIdParamSchema = z.object({
  postId: z.coerce.number().int().positive("Post ID tidak valid"),
});
