import jwt from "jsonwebtoken";
import { ENV } from "../config/index.js";

export function generateToken(payload = {}, expiresIn = "7d") {
  return jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET, { expiresIn });
}
