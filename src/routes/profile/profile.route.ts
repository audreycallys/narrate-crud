import { Router } from "express";
import ProfileController from "../../controllers/profile/profile.controller";

const router = Router();

// Read Profile
router.get("/", ProfileController.getProfile);

export default router;