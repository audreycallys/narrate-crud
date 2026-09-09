import { Request, Response } from "express";
import { db } from "../../config/db";
import { postsTable } from "../../config/schema";
import { uploadToCloudinary } from "../../services/cloudinary.service";
import { createPostSchema } from "../../validations/posts/post.validation";

export class PostsController {
  createPost = async (req: Request, res: Response) => {
    try {
      const validateData = createPostSchema.parse(req.body);

      const { categoryId, title, content, status } = validateData;

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
}

export default new PostsController();
