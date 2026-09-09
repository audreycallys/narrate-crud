import { Router } from "express";
import CategoriesController from "../../controllers/categories/categories.controller";

const router = Router();

// Get All Categories
router.get("/", CategoriesController.getCategories);

// Create Category
router.post("/", CategoriesController.createCategory);

// Get Category By ID
router.get("/:id", CategoriesController.getCategoryById);

export default router;
