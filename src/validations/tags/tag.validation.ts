import { z } from "zod";

export const tagQuerySchema = z.object({
  categoryId: z.coerce
    .number()
    .int()
    .positive("Category ID tidak valid")
    .optional(),
});
