import mongoose from "mongoose";
import { RESOURCE, STATUSCODE } from "../constants/index.js";
import ENV from "./environment.js";

const connectDB = async () => {
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
};

export default connectDB;
