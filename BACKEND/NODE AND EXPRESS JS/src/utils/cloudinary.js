import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { RESOURCE } from "../constants/index.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import ENV from "../config/environment.js";

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const fileName = file.originalname.replace(/\.[^/.]+$/, "");
    const uniqueFilename = uuidv4();

    return {
      folder: RESOURCE.IMAGES,
      public_id: `${fileName}-${uniqueFilename}`,
    };
  },
});

const upload = multer({ storage: storage });

export { cloudinary, upload };
