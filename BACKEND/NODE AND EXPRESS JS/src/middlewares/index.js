import bodyParser from "body-parser";
import cors from "cors";
import corsOptions from "./corsOptions.js";
import { RESOURCE } from "../constants/index.js";
import logger from "morgan";

export const middlewares = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cors(corsOptions),
  logger(RESOURCE.DEV),
];

export const addMiddlewares = (app) => {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
};
