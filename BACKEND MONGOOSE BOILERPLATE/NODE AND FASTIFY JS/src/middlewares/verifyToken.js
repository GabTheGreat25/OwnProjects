import jwt from "jsonwebtoken";
import createError from "http-errors";
import { getToken, isTokenBlacklisted } from "../middlewares/index.js";
import { ENV } from "../config/index.js";
import { STATUSCODE } from "../constants/index.js";

export function verifyJWT(req, reply, done) {
  const token = req.headers.authorization?.split(" ")[STATUSCODE.ONE];

  !token
    ? done(createError(STATUSCODE.UNAUTHORIZED, "Access denied"))
    : getToken() !== token
      ? done(createError(STATUSCODE.UNAUTHORIZED, "Invalid token"))
      : isTokenBlacklisted()
        ? done(createError(STATUSCODE.UNAUTHORIZED, "Token is Expired"))
        : (() => {
            req.user = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
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
