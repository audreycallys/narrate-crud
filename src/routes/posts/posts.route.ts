import { Router } from "express";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import PostsController from "../../controllers/posts/posts.controller";

const router = Router();

// Create Posts
router.post("/", uploadSingleImage, PostsController.createPost);

// Read All Posts
router.get("/", PostsController.getPosts);

// Read Post By ID
router.get("/:id", PostsController.getPostById);

export default router;
