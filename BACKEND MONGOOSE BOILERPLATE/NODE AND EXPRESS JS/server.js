import express from "express";
import { createServer } from "http";
import { addMiddlewares } from "./src/middlewares/index.js";
import { addRoutes } from "./src/routes/index.js";
import { addErrorHandler } from "./src/utils/index.js";
import { connectDB, ENV } from "./src/config/index.js";

const app = express();

function run() {
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
}

run();
