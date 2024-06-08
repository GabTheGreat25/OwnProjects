import { allowedOrigins } from "../config";
import { STATUSCODE } from "../constants";

export const corsOptions = {
  origin: (
    origin: string,
    callback: (error: Error | null, allow?: boolean) => void,
  ) => {
    allowedOrigins.indexOf(origin) !== STATUSCODE.NEGATIVE_ONE || !origin
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  exposedHeaders: ["Access-Control-Allow-Origin"],
};
