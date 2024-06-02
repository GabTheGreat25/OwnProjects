import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "./blacklist";
import { ENV } from "../config";

export function verifyJWT(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
): void {
  const token = req.headers.authorization?.split(" ")[1];

  !token
    ? next(new Error("Please login First"))
    : isTokenBlacklisted()
      ? next(new Error("Token is expired"))
      : (() => {
          req.user = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
          next();
        })();
}

export function authorizeRoles(...allowedRoles: string[]) {
  return function (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) {
    return allowedRoles.length === 0 ||
      !req.user.role ||
      allowedRoles.includes(req.user.role)
      ? next()
      : next(
          new Error(
            `Roles ${req.user.role} are not allowed to access this resource`,
          ),
        );
  };
}
