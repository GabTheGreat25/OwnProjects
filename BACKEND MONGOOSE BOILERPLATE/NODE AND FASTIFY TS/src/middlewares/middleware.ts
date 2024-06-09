import { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCompress from "@fastify/compress";
import fastifyFormbody from "@fastify/formbody";
import fastifyHelmet from "@fastify/helmet";
import { corsOptions } from "../config";

export const addMiddlewares = (app: FastifyInstance) => {
  app.register(fastifyFormbody);
  app.register(fastifyCors, corsOptions);
  app.register(fastifyCompress, { global: true });
  app.register(fastifyHelmet);
};
