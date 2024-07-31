import createError from "http-errors";
import {
  getToken,
  isTokenBlacklisted,
  extractToken,
  verifyToken,
} from "../middlewares/index.js";
import { STATUSCODE } from "../constants/index.js";

export function verifyJWT(req, reply, done) {
  const token = extractToken(req.headers.authorization);

  !token
    ? done(createError(STATUSCODE.UNAUTHORIZED, "Access denied"))
    : getToken() !== token
      ? done(createError(STATUSCODE.UNAUTHORIZED, "Invalid token"))
      : isTokenBlacklisted()
        ? done(createError(STATUSCODE.UNAUTHORIZED, "Token is Expired"))
        : (() => {
            req.user = verifyToken(token);
            done();
          })();
}

export function authorizeRoles(...allowedRoles) {
  return function (req, reply, done) {
    allowedRoles.length === STATUSCODE.ZERO ||
    !req.user.role ||
    allowedRoles.includes(req.user.role)
      ? done()
      : done(
          createError(
            STATUSCODE.UNAUTHORIZED,
            `Roles ${req.user.role} are not allowed to access this resource`,
          ),
        );
  };
}
