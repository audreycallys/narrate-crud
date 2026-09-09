import { Router } from "express";
import ProfileController from "../../controllers/profile/profile.controller";
import { uploadSingleImage } from "../../middleware/upload.middleware";

const router = Router();

// Read Profile
router.get("/", ProfileController.getProfile);

// Update Profile
router.put("/", uploadSingleImage, ProfileController.updateProfile);

export default router;
