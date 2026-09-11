import { Router } from "express";
import SavedController from "../../controllers/saved/saved.controller";

const router = Router();

// Create Saved
router.post("/:postId", SavedController.savePost);

export default router;
