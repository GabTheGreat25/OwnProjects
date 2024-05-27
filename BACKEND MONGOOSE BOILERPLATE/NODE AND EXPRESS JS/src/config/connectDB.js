import mongoose from "mongoose";
import { STATUSCODE } from "../constants/index.js";
import ENV from "./environment.js";

export default async function connectDB() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(url);
  } catch (err) {
    const mongoExit = STATUSCODE.ONE;
    process.exit(mongoExit);
  }
}
