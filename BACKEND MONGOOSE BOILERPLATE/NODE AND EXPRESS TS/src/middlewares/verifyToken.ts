import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import {
  getToken,
  isTokenBlacklisted,
  extractToken,
  verifyToken,
} from "../middlewares";
import { STATUSCODE } from "../constants";

export function verifyJWT(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
): void {
  const token = extractToken(req.headers.authorization || "");

  !token
    ? next(createError(STATUSCODE.UNAUTHORIZED, "Access denied"))
    : getToken() !== token
      ? next(createError(STATUSCODE.UNAUTHORIZED, "Invalid token"))
      : isTokenBlacklisted()
        ? next(createError(STATUSCODE.UNAUTHORIZED, "Token is Expired"))
        : (() => {
            req.user = verifyToken(token);
            next();
          })();
}

export function authorizeRoles(...allowedRoles: string[]) {
  return function (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) {
    return allowedRoles.length === STATUSCODE.ZERO ||
      !req.user.role ||
      allowedRoles.includes(req.user.role)
      ? next()
      : next(
          createError(
            STATUSCODE.UNAUTHORIZED,
            `Roles ${req.user.role} are not allowed to access this resource`,
          ),
        );
  };
}
