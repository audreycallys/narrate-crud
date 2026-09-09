import cloudinary from "../config/cloudinary";

// Helper upload ke Cloudinary via stream buffer
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "posts",
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder, // Nama folder tujuan // Diubah bukan "posts" tapi folder
        resource_type: "image", // Eksplisit tentukan tipe resource sebagai gambar
      },
      (error, result) => {
        if (error || !result) return reject(error);

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId);
};
