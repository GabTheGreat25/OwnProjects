import jwt from "jsonwebtoken";
import ENV from "../config/environment.js";
import { responseHandler } from "./index.js";
import { isTokenBlacklisted } from "../helpers/blacklist.js";

export default function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  !token
    ? responseHandler(res, "Please Log in First", [])
    : isTokenBlacklisted(token)
      ? responseHandler(res, "Token Expired", [])
      : (() => {
          try {
            req.user = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
            next();
          } catch (error) {
            responseHandler(res, "Invalid Token", []);
          }
        })();
}
