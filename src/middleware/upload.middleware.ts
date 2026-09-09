// import multer from "multer";

// const storage = multer.memoryStorage();

// export const uploadSingleImage = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // Maksimal 5MB
//   },
//   fileFilter: (_req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Hanya file gambar yang diperbolehkan!"));
//     }
//   },
// }).single("image"); // "image" adalah nama key/field saat upload file

import multer from "multer";

const storage = multer.memoryStorage();

export const uploadSingleImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedExtensions = /\.(jpg|jpeg|png|webp)$/i;
    const isValidMime = allowedMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.test(file.originalname);

    if (isValidMime || isValidExtension) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file JPG, JPEG, PNG, atau WEBP yang diperbolehkan!"));
    }
  },
}).single("image");
