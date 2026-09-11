import { Router } from "express";
import TagsController from "../../controllers/tags/tags.controller";

const router = Router();

// Read Tags
router.get("/", TagsController.getTags);

// Create Tag
router.post("/", TagsController.createTag);

// Update Tag
router.put("/:id", TagsController.updateTag);

// Delete Tag
router.delete("/:id", TagsController.deleteTag);

export default router;
