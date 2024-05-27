import "express-async-errors";
import express, { Express } from "express";
import { createServer } from "http";
import connectDB from "./src/config/connectDB";
import { addRoutes } from "./src/routes/index";
import { addMiddlewares } from "./src/middlewares/index";
import { addErrorHandler } from "./src/helpers/errorHandler";
import { addSession } from "./src/utils/index";
import ENV from "./src/config/environment";

const app: Express = express();

const run = () => {
  const hostServer = createServer(app);

  addMiddlewares(app);
  addSession(app);
  addRoutes(app);
  addErrorHandler(app);

  connectDB(ENV.DATABASE_URI).then(() => {
    console.log(`Host Database connected to ${ENV.DATABASE_URI}`);

    hostServer.listen(ENV.PORT, () => {
      console.log(`Host Server started on port ${ENV.PORT}`);
    });
  });
};

run();
