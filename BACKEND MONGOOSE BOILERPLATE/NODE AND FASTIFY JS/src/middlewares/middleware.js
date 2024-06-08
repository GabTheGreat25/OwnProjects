import fastifyCors from "@fastify/cors";
import fastifyCompress from "@fastify/compress";
import fastifyFormbody from "@fastify/formbody";
import fastifyHelmet from "@fastify/helmet";
import { corsOptions } from "../config/index.js";

export const addMiddlewares = (app) => {
  app.register(fastifyFormbody);
  app.register(fastifyCors, { origin: corsOptions });
  app.register(fastifyCompress, { global: true });
  app.register(fastifyHelmet);
};
