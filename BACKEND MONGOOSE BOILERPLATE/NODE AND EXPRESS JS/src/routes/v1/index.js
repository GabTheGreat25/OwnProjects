import { RESOURCE } from "../../constants/index.js";
import testsRoute from "./tests/route.js";
import testChildRoute from "./testsChild/route.js";
import userRoutes from "./users/route.js";

const routes = [
  {
    route: testsRoute,
  },
  {
    route: testChildRoute,
  },
  {
    route: userRoutes,
  },
];

export const V1 = routes.map((route) => ({
  url: RESOURCE.V1,
  route: route.route,
}));
