import { Router } from "express";
import CommentsController from "../../controllers/comments/comments.controller";

const router = Router();

// Create Comments
router.post("/:postId/comments", CommentsController.createComment);

// Get Comment By Post
router.get("/:postId/comments", CommentsController.getCommentsByPost);

// Delete Comment
router.delete("/:postId/comments/:id", CommentsController.deleteComment);

export default router;
