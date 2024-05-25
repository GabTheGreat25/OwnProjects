import { v2 as cloudinary } from "cloudinary";
import { UploadImages } from "../types";

export default async function multipleImages(
  files: Express.Multer.File[] | undefined,
  oldImagePublicIds: (string | undefined)[]
): Promise<UploadImages[]> {
  if (!files || !Array.isArray(files)) return [];

  for (const publicId of oldImagePublicIds) {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  const uploadPromises = files.map((file) =>
    cloudinary.uploader
      .upload(file.path, { public_id: file.filename })
      .then((result) => ({
        public_id: result.public_id,
        url: result.secure_url,
        originalname: file.originalname,
      }))
  );

  return Promise.all(uploadPromises);
}
