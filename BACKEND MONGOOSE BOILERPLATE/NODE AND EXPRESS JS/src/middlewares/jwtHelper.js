import jwt from "jsonwebtoken";
import createError from "http-errors";
import { ENV } from "../config/index.js";
import { STATUSCODE } from "../constants/index.js";

export function extractToken(authorizationHeader) {
  const token = authorizationHeader.split(" ")[STATUSCODE.ONE];

  if (!token)
    throw createError(STATUSCODE.UNAUTHORIZED, "Access token is missing");

  return token;
}

export function verifyToken(token) {
  const verifiedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);

  return verifiedToken;
}
