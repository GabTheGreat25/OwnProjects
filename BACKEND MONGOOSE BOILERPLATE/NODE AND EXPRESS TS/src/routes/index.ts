import { Express } from "express";
import { V1 } from "./v1";
import { RESOURCE } from "../constants";

const ROUTES: any[] = [...V1];

export const addRoutes = (app: Express) => {
  ROUTES.forEach((route) => {
    app.use(`${RESOURCE.API}${route.url}`, route.route);
  });
};
