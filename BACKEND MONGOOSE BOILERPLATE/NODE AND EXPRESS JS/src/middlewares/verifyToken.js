import createError from "http-errors";
import { getToken, isTokenBlacklisted } from "../middlewares/index.js";
import { STATUSCODE } from "../constants/index.js";
import { extractToken, verifyToken } from "../middlewares/index.js";

export function verifyJWT(req, res, next) {
  const token = extractToken(req.headers.authorization);

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
