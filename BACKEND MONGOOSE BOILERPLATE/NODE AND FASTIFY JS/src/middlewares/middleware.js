import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyHelmet from "@fastify/helmet";
import { corsOptions } from "../config/index.js";
import { transaction } from "./transaction.js";
import { RESOURCE } from "../constants/resource.js";

export const addMiddlewares = (app) => {
  app.register(fastifyFormbody);
  app.register(fastifyCors, { origin: corsOptions });
  app.register(fastifyHelmet);
  app.addHook(RESOURCE.PRE_HANDLER, transaction);
};
