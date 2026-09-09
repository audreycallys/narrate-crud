import { Router } from "express";
import CommentsController from "../../controllers/comments/comments.controller";

const router = Router();

// Create Comments
router.post("/:postId/comments", CommentsController.createComment);

// Get Comment By Post
router.get("/:postId/comments", CommentsController.getCommentsByPost);

export default router;
