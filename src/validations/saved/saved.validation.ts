import { z } from "zod";

export const savedPostIdSchema = z.object({
  postId: z.coerce.number().int().positive("Post ID tidak valid"),
});
