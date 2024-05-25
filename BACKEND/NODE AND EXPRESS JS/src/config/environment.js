import dotenv from "dotenv";
import { RESOURCE } from "../constants/index.js";

dotenv.config({
  path: "./src/config/.env",
});

const ENV = {
  NODE_ENV: process.env.NODE_ENV || RESOURCE.DEVELOPMENT,
  PORT: process.env.PORT,
  DATABASE_URI: process.env.DATABASE_URI,
  SALT_NUMBER: Number(process.env.SALT_NUMBER),
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export default ENV;
