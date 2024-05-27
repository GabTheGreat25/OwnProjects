import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ENV from "../config/environment";
import { responseHandler } from "./index";
import { isTokenBlacklisted } from "../helpers/blacklist";

export default function verifyJWT(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1];

  !token
    ? responseHandler(res, [], "Please Log in First")
    : isTokenBlacklisted(token)
    ? responseHandler(res, [], "Token Expired")
    : (() => {
        try {
          req.user = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
          next();
        } catch (error) {
          responseHandler(res, [], "Invalid Token");
        }
      })();
}
