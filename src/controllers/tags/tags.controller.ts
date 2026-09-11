import { Request, Response } from "express";
import { asc, eq } from "drizzle-orm";
import { db } from "../../config/db";
import { tagsTable } from "../../config/schema";
import { tagQuerySchema } from "../../validations/tags/tag.validation";

export class TagsController {
  // Membaca Semua Tags
  getTags = async (req: Request, res: Response) => {
    try {
      const validatedQuery = tagQuerySchema.parse(req.query);

      const { categoryId } = validatedQuery;

      const tags = categoryId
        ? await db
            .select()
            .from(tagsTable)
            .where(eq(tagsTable.categoryId, categoryId))
            .orderBy(asc(tagsTable.name))
        : await db.select().from(tagsTable).orderBy(asc(tagsTable.name));

      return res.status(200).json({
        success: true,
        message: "Get Tags Successfully",
        data: {
          tags: tags,
        },
      });
    } catch (error) {
      console.error("Get tags error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new TagsController();
