import mongoose from "mongoose";
import { RESOURCE, STATUSCODE } from "../constants/index.js";
import ENV from "./environment.js";

export default async function connectDB() {
  try {
    mongoose.set(RESOURCE.STRICT_QUERY, false);
    return (
      mongoose.connect(ENV.DATABASE_URI),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (err) {
    const mongoExit = STATUSCODE.ONE;
    process.exit(mongoExit);
  }
}
