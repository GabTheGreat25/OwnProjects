import allowedOrigins from "./allowedOrigins.js";
import { STATUSCODE } from "../constants/index.js";

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== STATUSCODE.NEGATIVE_ONE || !origin) {
      callback(null, true);
    } else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  exposedHeaders: ["Access-Control-Allow-Origin"],
};

export default corsOptions;
