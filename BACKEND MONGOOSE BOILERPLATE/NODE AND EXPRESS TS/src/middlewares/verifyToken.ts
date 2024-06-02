import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "./blacklist";
import { ENV } from "../config";
import { responseHandler } from "../utils";

export function verifyJWT(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
): void {
  const token = req.headers.authorization?.split(" ")[1];

  !token
    ? responseHandler(res, [], "Please Log in First")
    : isTokenBlacklisted()
      ? responseHandler(res, [], "Token Expired")
      : (() => {
          req.user = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
          next();
        })();
}
