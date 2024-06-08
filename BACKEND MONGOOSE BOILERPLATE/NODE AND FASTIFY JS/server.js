import { fastify } from "fastify";
import { addMiddlewares } from "./src/middlewares/index.js";
import { addRoutes } from "./src/routes/index.js";
import { addErrorHandler } from "./src/utils/index.js";
import { connectDB, ENV } from "./src/config/index.js";

const app = fastify({ logger: true });

function run() {
  addMiddlewares(app);
  addRoutes(app);
  addErrorHandler(app);

  connectDB(ENV.DATABASE_URI);
  app.log.info(`Host Database connected to ${ENV.DATABASE_URI}`);

  app.listen({ port: ENV.PORT, host: ENV.IP_ADDRESS });
  app.log.info(`Host Server started on port ${ENV.PORT}`);
}

run();
