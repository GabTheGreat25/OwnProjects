import { Express } from "express";
import session from "express-session";
import ENV from "../config/environment";
import { RESOURCE } from "../constants/index";

export default function addSession(app: Express) {
  app.use(
    session({
      secret: ENV.ACCESS_TOKEN_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: ENV.NODE_ENV === RESOURCE.PRODUCTION ? true : false },
    })
  );
}
