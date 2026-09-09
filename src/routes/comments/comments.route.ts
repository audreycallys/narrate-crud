import { Router } from "express";
import CommentsController from "../../controllers/comments/comments.controller";

const router = Router();

router.post("/:postId/comments", CommentsController.createComment);

export default router;
