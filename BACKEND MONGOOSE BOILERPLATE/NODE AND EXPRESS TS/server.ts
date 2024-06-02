import express, { Express } from "express";
import { createServer } from "http";
import { addMiddleware } from "./src/middlewares";
import { addRoutes } from "./src/routes";
import { addErrorHandler } from "./src/utils";
import { connectDB, ENV } from "./src/config";

const app: Express = express();

function run() {
  const hostServer = createServer(app);

  addMiddleware(app);
  addRoutes(app);
  addErrorHandler(app);

  connectDB(ENV.DATABASE_URI).then(() => {
    console.log(`Host Database connected to ${ENV.DATABASE_URI}`);

    hostServer.listen(ENV.PORT, () => {
      console.log(`Host Server started on port ${ENV.PORT}`);
    });
  });
}

run();
