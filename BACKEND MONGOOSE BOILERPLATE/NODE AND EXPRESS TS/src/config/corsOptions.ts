import { CorsOptions } from "cors";
import { allowedOrigins } from "../config";
import { STATUSCODE } from "../constants";
import createError from "http-errors";

export const corsOptions: CorsOptions = {
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
