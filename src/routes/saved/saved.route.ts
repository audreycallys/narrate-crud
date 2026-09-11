import { Router } from "express";
import SavedController from "../../controllers/saved/saved.controller";

const router = Router();

// Get Saved Posts
router.get("/", SavedController.getSavedPosts);

// Save Post
router.post("/:postId", SavedController.savePost);

// Delete Saved Post
router.delete("/:postId", SavedController.deleteSavedPost);

export default router;
