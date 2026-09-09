import { Request, Response } from "express";
import { db } from "../../config/db";
import { profilesTable } from "../../config/schema";
import { eq } from "drizzle-orm";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../services/cloudinary.service";
import { updateProfileSchema } from "../../validations/profile/profile.validation";

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

  // Update Profile
  updateProfile = async (req: Request, res: Response) => {
    try {
      const validateData = updateProfileSchema.parse(req.body);

      const { name, email, bio } = validateData;

      const [existingProfile] = await db.select().from(profilesTable).limit(1);

      if (!existingProfile) {
        return res.status(404).json({
          success: false,
          message: "Profile Not Found",
        });
      }

      let avatarUrl = existingProfile.avatarUrl;
      let avatarPublicId = existingProfile.avatarPublicId;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "profiles",
        );

        avatarUrl = uploadResult.secure_url;
        avatarPublicId = uploadResult.public_id;
      }

      const [updatedProfile] = await db
        .update(profilesTable)
        .set({
          name,
          email,
          bio,
          avatarUrl,
          avatarPublicId,
        })
        .where(eq(profilesTable.id, existingProfile.id))
        .returning();

      if (
        req.file &&
        existingProfile.avatarPublicId &&
        existingProfile.avatarPublicId !== avatarPublicId
      ) {
        try {
          await deleteFromCloudinary(existingProfile.avatarPublicId);
        } catch (error) {
          console.error("Delete old avatar error:", error);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          profile: updatedProfile,
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new ProfileController();
