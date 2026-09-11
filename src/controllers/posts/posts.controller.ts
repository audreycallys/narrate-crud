import { Request, Response } from "express";
import { db } from "../../config/db";
import { postsTable, postTagsTable, tagsTable } from "../../config/schema";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../services/cloudinary.service";
import {
  createPostSchema,
  postIdSchema,
  updatePostSchema,
} from "../../validations/posts/post.validation";
import { and, desc, eq, inArray } from "drizzle-orm";

export class PostsController {
  // Membuat Postingan
  createPost = async (req: Request, res: Response) => {
    try {
      const validateData = createPostSchema.parse(req.body);
      const { categoryId, title, content, status, tagIds } = validateData;

      if (tagIds && tagIds.length > 0) {
        const selectedTags = await db
          .select()
          .from(tagsTable)
          .where(inArray(tagsTable.id, tagIds));

        const invalidTag = selectedTags.find(
          (tag) => tag.categoryId !== categoryId,
        );

        if (invalidTag || selectedTags.length !== tagIds.length) {
          return res.status(400).json({
            success: false,
            message: "Tag tidak sesuai dengan category yang dipilih",
          });
        }
      }

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

      if (tagIds && tagIds.length > 0) {
        await db.insert(postTagsTable).values(
          tagIds.map((tagId) => ({
            postId: newPost.id,
            tagId: tagId,
          })),
        );
      }

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

      const postsWithTags = await Promise.all(
        posts.map(async (post) => {
          const tags = await db
            .select({
              id: tagsTable.id,
              name: tagsTable.name,
            })
            .from(postTagsTable)
            .innerJoin(tagsTable, eq(postTagsTable.tagId, tagsTable.id))
            .where(eq(postTagsTable.postId, post.id));

          return {
            ...post,
            tags,
          };
        }),
      );

      return res.status(200).json({
        success: true,
        message: "Get Posts Successfully",
        data: {
          posts: postsWithTags,
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

      const tags = await db
        .select({
          id: tagsTable.id,
          name: tagsTable.name,
        })
        .from(postTagsTable)
        .innerJoin(tagsTable, eq(postTagsTable.tagId, tagsTable.id))
        .where(eq(postTagsTable.postId, post.id));

      return res.status(200).json({
        success: true,
        message: "Post retrieved successfully",
        data: {
          post: {
            ...post,
            tags,
          },
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
      const { categoryId, title, content, status, tagIds } = validateData;
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

      if (tagIds && tagIds.length > 0) {
        const selectedTags = await db
          .select()
          .from(tagsTable)
          .where(inArray(tagsTable.id, tagIds));

        const invalidTag = selectedTags.find(
          (tag) => tag.categoryId !== categoryId,
        );

        if (invalidTag || selectedTags.length !== tagIds.length) {
          return res.status(400).json({
            success: false,
            message: "Tag tidak sesuai dengan category yang dipilih",
          });
        }
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

      if (tagIds) {
        await db.delete(postTagsTable).where(eq(postTagsTable.postId, id));

        if (tagIds.length > 0) {
          await db.insert(postTagsTable).values(
            tagIds.map((tagId) => ({
              postId: id,
              tagId: tagId,
            })),
          );
        }
      }

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
