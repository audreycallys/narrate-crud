import { Router } from "express";
import SavedController from "../../controllers/saved/saved.controller";

const router = Router();

// Get Saved Posts
router.get("/", SavedController.getSavedPosts);

// Save Post
router.post("/:postId", SavedController.savePost);

export default router;
