import { Request, Response } from "express";
import { asc, eq } from "drizzle-orm";
import { db } from "../../config/db";
import { tagsTable, categoriesTable } from "../../config/schema";
import {
  tagQuerySchema,
  createTagSchema,
  tagIdSchema,
  updateTagSchema,
} from "../../validations/tags/tag.validation";

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

  // Membuat Tag
  createTag = async (req: Request, res: Response) => {
    try {
      const validateData = createTagSchema.parse(req.body);

      const { categoryId, name } = validateData;

      const [category] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, categoryId));

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category Not Found",
        });
      }

      const [newTag] = await db
        .insert(tagsTable)
        .values({
          categoryId,
          name,
        })
        .returning();

      return res.status(201).json({
        success: true,
        message: "Tag created successfully",
        data: {
          tag: newTag,
        },
      });
    } catch (error) {
      console.error("Create tag error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Update Tag
  updateTag = async (req: Request, res: Response) => {
    try {
      const validatedParams = tagIdSchema.parse(req.params);
      const { id } = validatedParams;

      const validateData = updateTagSchema.parse(req.body);
      const { categoryId, name } = validateData;

      const [existingTag] = await db
        .select()
        .from(tagsTable)
        .where(eq(tagsTable.id, id));

      if (!existingTag) {
        return res.status(404).json({
          success: false,
          message: "Tag Not Found",
        });
      }

      const [category] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, categoryId));

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category Not Found",
        });
      }

      const [updatedTag] = await db
        .update(tagsTable)
        .set({
          categoryId,
          name,
        })
        .where(eq(tagsTable.id, id))
        .returning();

      return res.status(200).json({
        success: true,
        message: "Tag updated successfully",
        data: {
          tag: updatedTag,
        },
      });
    } catch (error) {
      console.error("Update tag error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new TagsController();
