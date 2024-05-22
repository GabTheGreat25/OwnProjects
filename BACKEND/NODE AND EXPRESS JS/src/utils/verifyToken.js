import jwt from "jsonwebtoken";
import ENV from "../config/environment.js";
import { responseHandler } from "./index.js";

function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  !token
    ? responseHandler(res, "Please Log in First", [])
    : (() => {
        try {
          req.user = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
          next();
        } catch (error) {
          responseHandler(res, "Invalid Token", []);
        }
      })();
}

export default verifyJWT;
