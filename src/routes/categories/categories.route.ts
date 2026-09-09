import { Router } from "express";
import CategoriesController from "../../controllers/categories/categories.controller";

const router = Router();

// Get All Categories
router.get("/", CategoriesController.getCategories);

// Create Category
router.post("/", CategoriesController.createCategory);

export default router;
