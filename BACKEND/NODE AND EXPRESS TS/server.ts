import "express-async-errors";
import express, { Express } from "express";
import { createServer } from "http";
import connectDB from "./src/config/connectDB";
import ENV from "./src/config/environment";

const app: Express = express();

const run = () => {
  const hostServer = createServer(app);

  connectDB(ENV.DATABASE_URI).then(() => {
    console.log(`Host Database connected to ${ENV.DATABASE_URI}`);

    hostServer.listen(ENV.PORT, () => {
      console.log(`Host Server started on port ${ENV.PORT}`);
    });
  });
};

run();
