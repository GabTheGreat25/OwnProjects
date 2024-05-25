import jwt from "jsonwebtoken";
import ENV from "../config/environment";

export default function generateToken(
  payload: any = {},
  expiresIn: string = "7d"
) {
  return jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET, { expiresIn });
}
