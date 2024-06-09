import { FastifyRequest, FastifyReply, DoneFuncWithErrOrRes } from "fastify";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import { getToken, isTokenBlacklisted } from "./index";
import { ENV } from "../config";
import { STATUSCODE } from "../constants";

export function verifyJWT(
  req: FastifyRequest & { user?: any },
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes,
) {
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
