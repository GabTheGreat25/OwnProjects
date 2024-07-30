import jwt from "jsonwebtoken";
import createError from "http-errors";
import { ENV } from "../config";
import { STATUSCODE } from "../constants";

export function extractToken(authorizationHeader: string) {
  const token = authorizationHeader.split(" ")[STATUSCODE.ONE];

  if (!token)
    throw createError(STATUSCODE.UNAUTHORIZED, "Access token is missing");

  return token;
}

export function verifyToken(token: string) {
  const verifiedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);

  return verifiedToken;
}
