import { FastifyInstance } from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { V1 } from "./v1";
import { RESOURCE } from "../constants";

const ROUTES: any[] = [...V1];

export const addRoutes = (app: FastifyInstance) => {
  app.register(fastifyMultipart);
  ROUTES.forEach((route) => {
    app.register(route.route, { prefix: `${RESOURCE.API}${route.url}` });
  });
};
