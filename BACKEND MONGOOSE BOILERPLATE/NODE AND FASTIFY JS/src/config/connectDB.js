import mongoose from "mongoose";
import { STATUSCODE } from "../constants/index.js";
import { ENV } from "../config/index.js";

export async function connectDB() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(ENV.DATABASE_URI);
  } catch (error) {
    console.error(error);
    process.exit(STATUSCODE.ONE);
  }
}
