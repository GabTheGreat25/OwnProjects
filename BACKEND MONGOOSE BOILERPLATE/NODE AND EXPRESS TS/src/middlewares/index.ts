import bodyParser from "body-parser";
import cors from "cors";
import corsOptions from "./corsOptions";
import { RESOURCE } from "../constants/index";
import logger from "morgan";
import { Express } from "express";

export const middlewares = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cors(corsOptions),
  logger(RESOURCE.DEV),
];

export const addMiddlewares = (app: Express) => {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
};
