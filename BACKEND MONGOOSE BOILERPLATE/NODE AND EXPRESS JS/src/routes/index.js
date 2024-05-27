import { RESOURCE } from "../constants/index.js";
import { V1 } from "./v1/index.js";

export const routes = [...V1];

export const addRoutes = (app) => {
  routes.forEach((route) => {
    app.use(`${RESOURCE.API}${route.url}`, route.route);
  });
};
