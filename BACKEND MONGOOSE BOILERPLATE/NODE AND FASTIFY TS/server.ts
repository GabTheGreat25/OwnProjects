import { fastify, FastifyInstance } from "fastify";
import { addMiddlewares } from "./src/middlewares/index";
import { addRoutes } from "./src/routes/index";
import { addErrorHandler } from "./src/utils/index";
import { connectDB, ENV } from "./src/config";

const app: FastifyInstance = fastify({ logger: true });

function run() {
  addMiddlewares(app);
  addRoutes(app);
  addErrorHandler(app);

  connectDB(ENV.DATABASE_URI);
  app.log.info(`Host Database connected to ${ENV.DATABASE_URI}`);

  app.listen({ port: Number(ENV.PORT), host: ENV.IP_ADDRESS });
  app.log.info(`Host Server started on port ${ENV.PORT}`);
}

run();
