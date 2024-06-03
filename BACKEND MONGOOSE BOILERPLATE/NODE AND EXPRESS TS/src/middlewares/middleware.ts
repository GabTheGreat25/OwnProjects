import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
import compression from "compression";
import { Express } from "express";
import { corsOptions } from "../config";
import { RESOURCE } from "../constants";

export const middleware = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cors(corsOptions),
  logger(RESOURCE.DEV),
  compression(),
];

export const addMiddlewares = (app: Express) => {
  middleware.forEach((middleware) => {
    app.use(middleware);
  });
};
