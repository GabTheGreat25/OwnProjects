import { allowedOrigins } from "../config/index.js";
import { STATUSCODE } from "../constants/index.js";
import createError from "http-errors";

export const corsOptions = {
  origin: (origin, callback) =>
    !origin || allowedOrigins.indexOf(origin) !== STATUSCODE.NEGATIVE_ONE
      ? callback(null, true)
      : callback(
          createError(STATUSCODE.FORBIDDEN, "Not allowed by CORS"),
          false,
        ),
  credentials: true,
  exposedHeaders: ["Access-Control-Allow-Origin"],
};
