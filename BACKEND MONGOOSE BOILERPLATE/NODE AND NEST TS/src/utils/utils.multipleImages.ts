import { v2 as cloudinary } from "cloudinary";
import { UploadImages } from "src/types";
import { RESOURCE } from "src/constants";

export async function multipleImages(
  files: Express.Multer.File[] | undefined,
  oldImagePublicIds: (string | undefined)[],
): Promise<UploadImages[]> {
  if (!files || !Array.isArray(files)) return [];

  for (const publicId of oldImagePublicIds)
    if (publicId) await cloudinary.uploader.destroy(publicId);

  return Promise.all(
    files.map(
      (file) =>
        new Promise<UploadImages>((resolve, reject) =>
          cloudinary.uploader
            .upload_stream(
              { folder: RESOURCE.CLOUDINARY_FOLDER },
              (error, result) => {
                resolve({
                  public_id: result?.public_id,
                  url: result?.secure_url.replace(
                    /\/([^\/]+)$/,
                    `/${file.originalname}`,
                  ),
                  originalname: file.originalname,
                });
              },
            )
            .end(file.buffer),
        ),
    ),
  );
}
