import { ForbiddenException } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { allowedOrigins } from "src/config";
import { STATUSCODE } from "src/constants/index";

export function addCorsOptions(): CorsOptions {
  return {
    origin: (origin, callback) =>
      !origin || allowedOrigins.indexOf(origin) !== STATUSCODE.NEGATIVE_ONE
        ? callback(null, true)
        : callback(new ForbiddenException("Not allowed by CORS"), false),
    credentials: true,
    exposedHeaders: ["Access-Control-Allow-Origin"],
  };
}
