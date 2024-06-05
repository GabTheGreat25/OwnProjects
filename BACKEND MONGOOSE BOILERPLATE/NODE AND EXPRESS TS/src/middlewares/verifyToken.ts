import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import { getToken, isTokenBlacklisted } from "../middlewares";
import { ENV } from "../config";
import { STATUSCODE } from "../constants";

export function verifyJWT(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
): void {
  const token = req.headers.authorization?.split(" ")[STATUSCODE.ONE];

  !token
    ? next(createError(STATUSCODE.UNAUTHORIZED, "Access denied"))
    : getToken() !== token
      ? next(createError(STATUSCODE.UNAUTHORIZED, "Invalid token"))
      : isTokenBlacklisted()
        ? next(createError(STATUSCODE.UNAUTHORIZED, "Token is Expired"))
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
