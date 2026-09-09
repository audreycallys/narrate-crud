import { Request, Response } from "express";
import { db } from "../../config/db";
import { categoriesTable } from "../../config/schema";
import { asc } from "drizzle-orm";

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
}

export default new CategoriesController();
