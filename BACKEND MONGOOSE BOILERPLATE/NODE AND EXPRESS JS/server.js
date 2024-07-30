import express from "express";
import { addMiddlewares } from "./src/middlewares/index.js";
import { addRoutes } from "./src/routes/index.js";
import { addErrorHandler } from "./src/utils/index.js";
import { connectDB, ENV } from "./src/config/index.js";

const app = express();

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
