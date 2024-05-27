import session from "express-session";
import ENV from "../config/environment.js";
import { RESOURCE } from "../constants/index.js";

export default function addSession(app) {
  app.use(
    session({
      secret: ENV.ACCESS_TOKEN_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: ENV.NODE_ENV === RESOURCE.PRODUCTION ? true : false },
    }),
  );
}
