import { Router } from "express";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import PostsController from "../../controllers/posts/posts.controller";

const router = Router();

// Create
router.post(
  "/",
  uploadSingleImage,
  PostsController.createPost
);

export default router;