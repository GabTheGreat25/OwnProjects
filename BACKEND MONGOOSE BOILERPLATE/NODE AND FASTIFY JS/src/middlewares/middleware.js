import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyHelmet from "@fastify/helmet";
import { corsOptions } from "../config/index.js";

export const addMiddlewares = (app) => {
  app.register(fastifyFormbody);
  app.register(fastifyCors, { origin: corsOptions });
  app.register(fastifyHelmet);
};
