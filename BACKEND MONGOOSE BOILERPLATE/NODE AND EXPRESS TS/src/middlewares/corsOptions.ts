import allowedOrigins from "./allowedOrigins";
import { STATUSCODE } from "../constants/index";
import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: (origin, callback) =>
    allowedOrigins.indexOf(origin || "") !== STATUSCODE.NEGATIVE_ONE || !origin
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS")),
  credentials: true,
  exposedHeaders: ["Access-Control-Allow-Origin"],
};

export default corsOptions;
