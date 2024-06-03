import jwt from "jsonwebtoken";
import createError from "http-errors";
import { isTokenBlacklisted } from "../middlewares/index.js";
import { ENV } from "../config/index.js";
import { STATUSCODE } from "../constants/index.js";

export function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[STATUSCODE.ONE];

  !token
    ? next(createError(STATUSCODE.UNAUTHORIZED, "Please login First"))
    : isTokenBlacklisted()
      ? next(createError(STATUSCODE.UNAUTHORIZED, "Token is Expired"))
      : (() => {
          req.user = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
          next();
        })();
}

export function authorizeRoles(...allowedRoles) {
  return function (req, res, next) {
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
