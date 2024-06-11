import testsRoute from "./tests/route";
import testChildRoute from "./testsChild/route";
import userRoutes from "./users/route";
import { RESOURCE } from "../../constants";

const routes = [
  {
    url: RESOURCE.TESTS,
    route: testsRoute,
  },
  {
    url: RESOURCE.TESTS_CHILD,
    route: testChildRoute,
  },
  {
    url: RESOURCE.USERS,
    route: userRoutes,
  },
];

export const V1 = routes.map((route: any) => ({
  url: `${RESOURCE.V1}${route.url}`,
  route: route.route,
}));
