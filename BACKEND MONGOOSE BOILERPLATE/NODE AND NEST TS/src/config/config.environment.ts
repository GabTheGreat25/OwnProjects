import * as dotenv from "dotenv";
import { RESOURCE } from "src/constants";

dotenv.config({
  path: "./src/config/.env",
});

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || RESOURCE.DEVELOPMENT,
  PORT: process.env.PORT || 4000,
  DATABASE_URI:
    process.env.DATABASE_URI ||
    "mongodb://localhost:27017/YOUR_DATABASE_NAME?directConnection=true",
  SALT_NUMBER: Number(process.env.SALT_NUMBER) || 12,
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "your_access_token_secret",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "your_cloud_name",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "your_api_key",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "your_api_secret",
  EMAIL: process.env.EMAIL || "your_email",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "your_email_password",
};
