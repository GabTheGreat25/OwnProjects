import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
import compression from "compression";
import { corsOptions } from "../config/index.js";
import { RESOURCE } from "../constants/index.js";

export const middlewares = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cors(corsOptions),
  logger(RESOURCE.DEV),
  compression(),
];

export const addMiddlewares = (app) => {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
};
