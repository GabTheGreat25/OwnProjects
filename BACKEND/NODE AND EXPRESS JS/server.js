import "express-async-errors";
import express from "express";
import { createServer } from "http";
import connectDB from "./src/config/connectDB.js";
import { addRoutes } from "./src/routes/index.js";
import { addMiddlewares } from "./src/middlewares/index.js";
import { addErrorHandler } from "./src/utils/errorHandler.js";
import ENV from "./src/config/environment.js";

const app = express();

const run = () => {
  const hostServer = createServer(app);

  addMiddlewares(app);
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
