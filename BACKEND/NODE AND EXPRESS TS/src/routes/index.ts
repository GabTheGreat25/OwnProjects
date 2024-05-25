import { RESOURCE } from "../constants/index";
import { V1 } from "./v1/index";
import { Express } from "express";

const ROUTES: any[] = [...V1];

export const addRoutes = (app: Express) => {
  ROUTES.forEach((route) => {
    app.use(`${RESOURCE.API}${route.url}`, route.route);
  });
};
