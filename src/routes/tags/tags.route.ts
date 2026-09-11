import { Router } from "express";
import TagsController from "../../controllers/tags/tags.controller";

const router = Router();

router.get("/", TagsController.getTags);

export default router;
