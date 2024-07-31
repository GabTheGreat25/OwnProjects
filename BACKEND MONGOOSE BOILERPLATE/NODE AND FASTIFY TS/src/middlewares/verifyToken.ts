import { FastifyRequest, FastifyReply, DoneFuncWithErrOrRes } from "fastify";
import createError from "http-errors";
import {
  getToken,
  isTokenBlacklisted,
  extractToken,
  verifyToken,
} from "../middlewares";
import { STATUSCODE } from "../constants";

export function verifyJWT(
  req: FastifyRequest & { user?: any },
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes,
) {
  const token = extractToken(req.headers.authorization || "");

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

export function authorizeRoles(...allowedRoles: string[]) {
  return function (
    req: FastifyRequest & { user?: any },
    reply: FastifyReply,
    done: DoneFuncWithErrOrRes,
  ) {
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
