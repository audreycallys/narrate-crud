import { Router } from "express";
import CategoriesController from "../../controllers/categories/categories.controller";

const router = Router();

// Get All Categories
router.get("/", CategoriesController.getCategories);

export default router;
