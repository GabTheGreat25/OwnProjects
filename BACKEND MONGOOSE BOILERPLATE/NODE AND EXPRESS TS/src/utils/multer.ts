import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { cloudinary } from "../config/cloudinary";
import { RESOURCE } from "../constants";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: RESOURCE.IMAGES,
      public_id: `${file.originalname.replace(/\.[^/.]+$/, "")}-${uuidv4()}`,
    };
  },
});

export const upload = multer({ storage: storage });
