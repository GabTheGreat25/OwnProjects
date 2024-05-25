import { RESOURCE } from "../../constants/index";
import testsRoute from "./tests/route";
import testChildRoute from "./testsChild/route";
import userRoutes from "./users/route";

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

export const V1 = routes.map((route: any) => ({
  url: RESOURCE.V1,
  route: route.route,
}));
