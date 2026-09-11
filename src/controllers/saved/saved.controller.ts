import { Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../../config/db";
import { postsTable, savedPostsTable } from "../../config/schema";
import { savedPostIdSchema } from "../../validations/saved/saved.validation";

export class SavedController {
  // Menyimpan Post
  savePost = async (req: Request, res: Response) => {
    try {
      const validatedParams = savedPostIdSchema.parse(req.params);

      const { postId } = validatedParams;

      const [post] = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, postId));

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post Not Found",
        });
      }

      const [existingSavedPost] = await db
        .select()
        .from(savedPostsTable)
        .where(eq(savedPostsTable.postId, postId));

      if (existingSavedPost) {
        return res.status(409).json({
          success: false,
          message: "Post already saved",
        });
      }

      const [savedPost] = await db
        .insert(savedPostsTable)
        .values({
          postId,
        })
        .returning();

      return res.status(201).json({
        success: true,
        message: "Post saved successfully",
        data: {
          savedPost,
        },
      });
    } catch (error) {
      console.error("Save post error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Membaca Semua Postingan Tersimpan
  getSavedPosts = async (req: Request, res: Response) => {
    try {
      const savedPosts = await db
        .select({
          postId: postsTable.id,
          categoryId: postsTable.categoryId,
          title: postsTable.title,
          content: postsTable.content,
          imageUrl: postsTable.imageUrl,
          status: postsTable.status,
          viewCount: postsTable.viewCount,
          createdAt: postsTable.createdAt,
          savedAt: savedPostsTable.createdAt,
        })
        .from(savedPostsTable)
        .innerJoin(postsTable, eq(savedPostsTable.postId, postsTable.id))
        .orderBy(desc(savedPostsTable.createdAt));

      return res.status(200).json({
        success: true,
        message: "Get Saved Posts Successfully",
        data: {
          savedPosts: savedPosts,
        },
      });
    } catch (error) {
      console.error("Get saved posts error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new SavedController();
