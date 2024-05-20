import jwt from "jsonwebtoken";
import ENV from "../config/environment.js";

export default (payload = {}, expiresIn = "7d") => {
  return jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET, { expiresIn });
};
