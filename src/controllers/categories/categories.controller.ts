import { Request, Response } from "express";
import { db } from "../../config/db";
import { categoriesTable } from "../../config/schema";
import { asc, eq } from "drizzle-orm";
import {
  createCategorySchema,
  categoryIdSchema,
  updateCategorySchema,
} from "../../validations/categories/category.validation";

export class CategoriesController {
  // Membaca Semua Category
  getCategories = async (req: Request, res: Response) => {
    try {
      const categories = await db
        .select()
        .from(categoriesTable)
        .orderBy(asc(categoriesTable.name));

      return res.status(200).json({
        success: true,
        message: "Get Categories Successfully",
        data: {
          categories: categories,
        },
      });
    } catch (error) {
      console.error("Get categories error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Membuat Category
  createCategory = async (req: Request, res: Response) => {
    try {
      const validateData = createCategorySchema.parse(req.body);

      const { name, description } = validateData;

      const [newCategory] = await db
        .insert(categoriesTable)
        .values({
          name,
          description,
        })
        .returning();

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: {
          category: newCategory,
        },
      });
    } catch (error) {
      console.error("Create category error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Membaca Category Berdasarkan ID
  getCategoryById = async (req: Request, res: Response) => {
    try {
      const validatedParams = categoryIdSchema.parse(req.params);
      const { id } = validatedParams;

      const [category] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, id));

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category Not Found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Category retrieved successfully",
        data: {
          category: category,
        },
      });
    } catch (error) {
      console.error("Get category by id error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Update Category
  updateCategory = async (req: Request, res: Response) => {
    try {
      const validatedParams = categoryIdSchema.parse(req.params);
      const { id } = validatedParams;

      const validateData = updateCategorySchema.parse(req.body);
      const { name, description } = validateData;

      const [existingCategory] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, id));

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category Not Found",
        });
      }

      const [updatedCategory] = await db
        .update(categoriesTable)
        .set({
          name,
          description,
        })
        .where(eq(categoriesTable.id, id))
        .returning();

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: {
          category: updatedCategory,
        },
      });
    } catch (error) {
      console.error("Update category error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new CategoriesController();
