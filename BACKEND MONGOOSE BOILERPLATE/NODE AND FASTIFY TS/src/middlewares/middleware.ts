import { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyHelmet from "@fastify/helmet";
import { corsOptions } from "../config";
import { transaction } from "./transaction";

export const addMiddlewares = (app: FastifyInstance) => {
  app.register(fastifyFormbody);
  app.register(fastifyCors, corsOptions);
  app.register(fastifyHelmet);
  app.addHook("preHandler", transaction);
};
