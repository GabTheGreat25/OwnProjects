import express, { Express } from "express";
import { addMiddlewares } from "./src/middlewares";
import { addRoutes } from "./src/routes";
import { addErrorHandler } from "./src/utils";
import { connectDB, ENV } from "./src/config";

const app: Express = express();

function run() {
  addMiddlewares(app);
  addRoutes(app);
  addErrorHandler(app);

  connectDB(ENV.DATABASE_URI).then(() => {
    console.log(`Host Database connected to ${ENV.DATABASE_URI}`);
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  });
}

run();
