import { Request, Response } from "express";
import { db } from "../../config/db";
import { postsTable } from "../../config/schema";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../services/cloudinary.service";
import {
  createPostSchema,
  postIdSchema,
  updatePostSchema,
} from "../../validations/posts/post.validation";
import { and, desc, eq } from "drizzle-orm";

export class PostsController {
  // Membuat Postingan
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

  // Membaca Semua Postingan
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

  // Membaca Postingan Berdasarkan Id
  getPostById = async (req: Request, res: Response) => {
    try {
      const validatedParams = postIdSchema.parse(req.params);
      const { id } = validatedParams;
      const [post] = await db
        .select()
        .from(postsTable)
        .where(and(eq(postsTable.id, id), eq(postsTable.status, "published")));

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post Not Found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Post retrieved successfully",
        data: {
          post: post,
        },
      });
    } catch (error) {
      console.error("Get post by id error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Update Postingan
  updatePost = async (req: Request, res: Response) => {
    try {
      const validatedParams = postIdSchema.parse(req.params);
      const { id } = validatedParams;
      const validateData = updatePostSchema.parse(req.body);
      const { categoryId, title, content, status } = validateData;
      const [existingPost] = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, id));

      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: "Post Not Found",
        });
      }

      let imageUrl = existingPost.imageUrl;
      let imagePublicId = existingPost.imagePublicId;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);

        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      const [updatedPost] = await db
        .update(postsTable)
        .set({
          categoryId,
          title,
          content,
          imageUrl,
          imagePublicId,
          status,
        })
        .where(eq(postsTable.id, id))
        .returning();

      if (
        req.file &&
        existingPost.imagePublicId &&
        existingPost.imagePublicId !== imagePublicId
      ) {
        try {
          await deleteFromCloudinary(existingPost.imagePublicId);
        } catch (error) {
          console.error("Delete old image error:", error);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: {
          post: updatedPost,
        },
      });
    } catch (error) {
      console.error("Update post error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Hapus Postingan
  deletePost = async (req: Request, res: Response) => {
    try {
      const validatedParams = postIdSchema.parse(req.params);
      const { id } = validatedParams;

      const [existingPost] = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, id));

      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: "Post Not Found",
        });
      }

      await db.delete(postsTable).where(eq(postsTable.id, id));

      if (existingPost.imagePublicId) {
        try {
          await deleteFromCloudinary(existingPost.imagePublicId);
        } catch (error) {
          console.error("Delete image error:", error);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Delete post error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new PostsController();
