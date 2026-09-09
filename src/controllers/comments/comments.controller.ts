import { Request, Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../../config/db";
import { commentsTable, postsTable } from "../../config/schema";
import {
  createCommentSchema,
  postIdParamSchema,
} from "../../validations/comments/comment.validation";

export class CommentsController {
  // Membuat Comment
  createComment = async (req: Request, res: Response) => {
    try {
      const validatedParams = postIdParamSchema.parse(req.params);
      const { postId } = validatedParams;

      const validateData = createCommentSchema.parse(req.body);
      const { authorName, authorEmail, comment } = validateData;

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

      const [newComment] = await db
        .insert(commentsTable)
        .values({
          postId,
          authorName,
          authorEmail,
          comment,
        })
        .returning();

      return res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: {
          comment: newComment,
        },
      });
    } catch (error) {
      console.error("Create comment error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Membaca Comment Berdasarkan Post
  getCommentsByPost = async (req: Request, res: Response) => {
    try {
      const validatedParams = postIdParamSchema.parse(req.params);
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

      const comments = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.postId, postId))
        .orderBy(desc(commentsTable.createdAt));

      return res.status(200).json({
        success: true,
        message: "Get Comments Successfully",
        data: {
          comments: comments,
        },
      });
    } catch (error) {
      console.error("Get comments error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new CommentsController();
