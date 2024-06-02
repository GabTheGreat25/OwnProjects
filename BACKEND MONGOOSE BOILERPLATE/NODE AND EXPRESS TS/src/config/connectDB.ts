import mongoose from "mongoose";
import { STATUSCODE } from "../constants";

export async function connectDB(url: string) {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(url);
  } catch (err) {
    const mongoExit = STATUSCODE.ONE;
    process.exit(mongoExit);
  }
}
