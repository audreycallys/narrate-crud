import { Request, Response } from "express";
import { db } from "../../config/db";
import { profilesTable } from "../../config/schema";

export class ProfileController {
  // Membaca Profile
  getProfile = async (req: Request, res: Response) => {
    try {
      const [profile] = await db.select().from(profilesTable).limit(1);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile Not Found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Get Profile Successfully",
        data: {
          profile: profile,
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new ProfileController();
