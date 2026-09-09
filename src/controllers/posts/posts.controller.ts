import { Request, Response } from "express";
import { db } from "../../config/db";
import { postsTable } from "../../config/schema";
import { uploadToCloudinary } from "../../services/cloudinary.service";
import { createPostSchema, postIdSchema } from "../../validations/posts/post.validation";
import { and, desc, eq } from "drizzle-orm";

export class PostsController {
  // Membuat Postingan Artikel
  createPost = async (req: Request, res: Response) => {
    try {
      const validateData = createPostSchema.parse(req.body);

      const { categoryId, authorName, title, content, status } = validateData;

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);

        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      const [newPost] = await db
        .insert(postsTable)
        .values({
          categoryId,
          authorName,
          title,
          content,
          imageUrl,
          imagePublicId,
          status,
        })
        .returning();

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: {
          post: newPost,
        },
      });
    } catch (error) {
      console.error("Create post error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Membaca Semua Artikel
  getPosts = async (req: Request, res: Response) => {
    try {
      const posts = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.status, "published"))
        .orderBy(desc(postsTable.createdAt));

      return res.status(200).json({
        success: true,
        message: "Get Posts Successfully",
        data: {
          posts: posts,
        },
      });
    } catch (error) {
      console.error("Get posts error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Membaca Artikel Berdasarkan Id
}

export default new PostsController();
