import { allowedOrigins } from "../config/index.js";
import { STATUSCODE } from "../constants/index.js";

export const corsOptions = {
  origin: (origin, callback) =>
    allowedOrigins.indexOf(origin || "") !== STATUSCODE.NEGATIVE_ONE || !origin
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS")),
  credentials: true,
  exposedHeaders: ["Access-Control-Allow-Origin"],
};
