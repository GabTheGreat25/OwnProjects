import mongoose from "mongoose";
import { STATUSCODE } from "../constants";

export async function connectDB(url: string) {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(url);
  } catch (error) {
    console.error(error);
    process.exit(STATUSCODE.ONE);
  }
}
